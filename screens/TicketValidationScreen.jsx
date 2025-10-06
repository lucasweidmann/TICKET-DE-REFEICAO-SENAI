import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ImageBackground,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

// Tela de Validação de Tickets
export default function TicketValidationScreen() {
  const [ticketsHoje, setTicketsHoje] = useState([]); // Lista de tickets do dia
  const [activeTab, setActiveTab] = useState("pendentes"); // Aba atual: pendentes ou validados

  // Coordenadas do local permitido (ex: SENAI)
  const allowedCoords = {
    latitude: -27.61838134931327,
    longitude: -48.66277801339434,
  };
  const allowedRadius = 100; // Raio máximo em metros

  // Função para carregar os tickets armazenados localmente (AsyncStorage)
  const loadTickets = async () => {
    const today = new Date().toDateString();
    const stored = JSON.parse(await AsyncStorage.getItem("ticketsHoje")) || [];
    setTicketsHoje(stored.filter((t) => t.date === today)); // Filtra apenas os tickets do dia atual
  };

  // Carrega tickets automaticamente ao abrir a tela
  useEffect(() => {
    loadTickets();
  }, []);

  // Cálculo da distância entre coordenadas (Fórmula de Haversine)
  const getDistanceFromLatLonInM = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Raio da Terra em metros
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Função principal: Validação de ticket com base na localização
  const validateTicket = async (ticket) => {
    // Solicita permissão de localização ao usuário
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return Alert.alert("Permissão Negada");

    // Obtém localização atual
    const current = await Location.getCurrentPositionAsync({});
    const distance = getDistanceFromLatLonInM(
      current.coords.latitude,
      current.coords.longitude,
      allowedCoords.latitude,
      allowedCoords.longitude
    );

    // Se o usuário estiver fora da área permitida, bloqueia a validação
    if (distance > allowedRadius)
      return Alert.alert("Erro", "Fora da Região Permitida");

    // Marca o ticket como validado no AsyncStorage
    const allTickets =
      JSON.parse(await AsyncStorage.getItem("ticketsHoje")) || [];
    const updatedTickets = allTickets.map((t) =>
      t.aluno.matricula === ticket.aluno.matricula
        ? { ...t, validatedAt: new Date().toLocaleTimeString() } // Adiciona horário de validação
        : t
    );

    // Salva lista atualizada e confirma ao usuário
    await AsyncStorage.setItem("ticketsHoje", JSON.stringify(updatedTickets));
    Alert.alert("Sucesso", `Ticket do aluno ${ticket.aluno.nome} validado!`);
    loadTickets(); // Atualiza a lista na tela
  };

  // Separa os tickets em pendentes e validados
  const pendentes = ticketsHoje.filter((t) => !t.validatedAt);
  const validados = ticketsHoje.filter((t) => t.validatedAt);

  // Renderiza cada item da lista de tickets
  const renderTicket = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Nome: {item.aluno.nome}</Text>
      <Text style={styles.cardText}>Matrícula: {item.aluno.matricula}</Text>
      <Text style={styles.cardText}>
        Pedido às: {item.requestedAt || "--:--"}
      </Text>

      {item.validatedAt ? (
        // Exibe horário se já estiver validado
        <Text style={[styles.cardText, { color: "green" }]}>
          Validado às {item.validatedAt}
        </Text>
      ) : (
        // Caso contrário, mostra botão de validação
        <TouchableOpacity
          style={styles.button}
          onPress={() => validateTicket(item)}
        >
          <Text style={styles.buttonText}>Validar Ticket</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Interface principal da tela
  return (
    <ImageBackground
      source={require("../assets/planodefundo.jpeg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.header}>Validação de Tickets</Text>

        {/* Abas de navegação: Pendentes / Validados */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "pendentes" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("pendentes")}
          >
            <Text style={styles.tabText}>Pendentes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "validados" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("validados")}
          >
            <Text style={styles.tabText}>Validados</Text>
          </TouchableOpacity>
        </View>

        {/* Exibição condicional conforme a aba selecionada */}
        {activeTab === "pendentes" ? (
          pendentes.length === 0 ? (
            <Text style={styles.noTickets}>Nenhum Ticket Pendente</Text>
          ) : (
            <FlatList
              data={pendentes}
              keyExtractor={(item) => item.aluno.matricula}
              renderItem={renderTicket}
            />
          )
        ) : validados.length === 0 ? (
          <Text style={styles.noTickets}>Nenhum Ticket Validado</Text>
        ) : (
          <FlatList
            data={validados}
            keyExtractor={(item) => item.aluno.matricula}
            renderItem={renderTicket}
          />
        )}
      </View>
    </ImageBackground>
  );
}

// Estilos visuais da tela
const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 110, paddingHorizontal: 20 },
  header: { fontSize: 28, fontWeight: "bold", color: "#000", marginBottom: 20 },
  tabs: { flexDirection: "row", justifyContent: "center", marginBottom: 15 },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: "center",
  },
  activeTab: { backgroundColor: "#000" },
  tabText: { color: "#fff", fontWeight: "bold" },
  card: {
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardText: { color: "#000", fontSize: 16, marginBottom: 4 },
  button: {
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  noTickets: {
    color: "#000",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
