import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ImageBackground,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import planoDataUri from "../assets/planodefundo";

// Tela de recebimento de tickets pelos alunos
export default function TicketReceiptScreen() {
  // Estados principais de controle
  const [isBreakActive, setIsBreakActive] = useState(false); // Se o intervalo está ativo
  const [hasTicketToday, setHasTicketToday] = useState(false); // Se o aluno já pegou ticket hoje
  const [inRegion, setInRegion] = useState(false); // Se está dentro da área permitida

  // Coordenadas e parâmetros de validação de local
  const allowedCoords = {
    latitude: -27.618398,
    longitude: -48.662857,
  };
  const allowedRadius = 100; // Raio permitido (em metros)

  // Configuração do horário de intervalo
  const breakStartHour = 15;
  const breakStartMinute = 0;
  const breakDurationMinutes = 15;
  const toleranceMinutes = 5;

  // Verifica se o aluno pode receber o ticket
  const checkEligibility = async () => {
    const aluno = JSON.parse(await AsyncStorage.getItem("user"));
    if (!aluno) return;

    const now = new Date();

    // Calcula janela de tempo válida (intervalo + tolerância)
    const breakStart = new Date();
    breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);

    const breakStartWithTolerance = new Date(breakStart);
    breakStartWithTolerance.setMinutes(
      breakStartWithTolerance.getMinutes() - toleranceMinutes
    );

    const breakEnd = new Date(breakStart);
    breakEnd.setMinutes(breakEnd.getMinutes() + breakDurationMinutes);

    // Atualiza estado se estiver dentro do horário permitido
    setIsBreakActive(now >= breakStartWithTolerance && now <= breakEnd);

    // Verifica se o aluno já retirou ticket hoje
    const today = now.toDateString();
    const storedTickets =
      JSON.parse(await AsyncStorage.getItem("ticketsHoje")) || [];
    const todayTicket = storedTickets.find(
      (t) =>
        t.date === today && t.aluno && t.aluno.matricula === aluno.matricula
    );

    setHasTicketToday(!!todayTicket);
  };

  // Executa verificação inicial e repete a cada 10 segundos
  useEffect(() => {
    checkEligibility();
    const interval = setInterval(checkEligibility, 10000);
    return () => clearInterval(interval);
  }, []);

  // Função para calcular distância entre duas coordenadas (Haversine)
  const getDistanceFromLatLonInM = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Raio da Terra em metros
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Função principal de recebimento do ticket
  const receiveTicket = async () => {
    const aluno = JSON.parse(await AsyncStorage.getItem("user"));
    if (!aluno) return Alert.alert("Erro", "Aluno não Encontrado.");

    // Bloqueia fora do horário do intervalo
    if (!isBreakActive)
      return Alert.alert("Erro", "Ainda não é Horário do Intervalo.");

    // Verifica se já pegou ticket hoje
    const storedTickets =
      JSON.parse(await AsyncStorage.getItem("ticketsHoje")) || [];
    const today = new Date().toDateString();
    if (
      storedTickets.some(
        (t) => t.date === today && t.aluno.matricula === aluno.matricula
      )
    )
      return Alert.alert("Erro", "Você já Resgatou um Ticket Hoje.");

    // Solicita permissão de localização
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted")
      return Alert.alert("Erro", "Não foi Possível Acessar a Localização.");

    // Obtém posição atual e verifica distância até o ponto permitido
    const location = await Location.getCurrentPositionAsync({});
    const distance = getDistanceFromLatLonInM(
      location.coords.latitude,
      location.coords.longitude,
      allowedCoords.latitude,
      allowedCoords.longitude
    );

    // Se estiver fora da área, bloqueia
    if (distance > allowedRadius)
      return Alert.alert("Erro", "Fora da Área Permitida.");

    setInRegion(true);

    // Cria novo ticket e salva no AsyncStorage
    const newTicket = {
      date: today,
      used: false,
      aluno: { nome: aluno.nome, matricula: aluno.matricula },
      requestedAt: new Date().toLocaleTimeString(),
      validatedAt: null,
    };
    await AsyncStorage.setItem(
      "ticketsHoje",
      JSON.stringify([...storedTickets, newTicket])
    );

    setHasTicketToday(true);
    Alert.alert("Sucesso", "Ticket Recebido!");
  };

  // Controle de imagem de fundo (tratamento caso o arquivo local falhe)
  let bgSource;
  try {
    bgSource = require("../assets/planodefundo.jpeg");
  } catch (e) {
    bgSource = { uri: planoDataUri };
  }

  // Interface da tela
  return (
    <ImageBackground source={bgSource} style={{ flex: 1 }} resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.header}>Receber Ticket</Text>

        {/* Exibe status atual do aluno (localização e ticket) */}
        <Text style={styles.status}>
          Região: {inRegion ? "Dentro da Escola" : "Fora da Escola"}
        </Text>

        {/* Exibe botão ou mensagem conforme situação */}
        {hasTicketToday ? (
          <Text style={styles.receivedText}>
            Status: Ticket já registrado hoje
          </Text>
        ) : isBreakActive ? (
          <TouchableOpacity style={styles.button} onPress={receiveTicket}>
            <Text style={styles.buttonText}>Receber Ticket</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.waitText}>
            Aguardando horário do intervalo...
          </Text>
        )}
      </View>
    </ImageBackground>
  );
}

// Estilos visuais e de layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: { fontSize: 28, fontWeight: "bold", color: "#000", marginBottom: 20 },
  status: { fontSize: 16, color: "#000", marginBottom: 20 },
  receivedText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    marginVertical: 10,
  },
  waitText: { fontSize: 16, color: "#555", marginVertical: 10 },
  button: {
    backgroundColor: "#000",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
