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

export default function TicketReceiptScreen() {
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [hasTicketToday, setHasTicketToday] = useState(false);
  const [inRegion, setInRegion] = useState(false);

  const allowedCoords = {
    latitude: -27.61838134931327,
    longitude: -48.66277801339434,
  };
  const allowedRadius = 100;
  const breakStartHour = 15;
  const breakStartMinute = 0;
  const breakDurationMinutes = 15;
  const toleranceMinutes = 5;

  const checkEligibility = async () => {
    const aluno = JSON.parse(await AsyncStorage.getItem("user"));
    if (!aluno) return;

    const now = new Date();
    const breakStart = new Date();
    breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);

    const breakStartWithTolerance = new Date(breakStart);
    breakStartWithTolerance.setMinutes(
      breakStartWithTolerance.getMinutes() - toleranceMinutes
    );

    const breakEnd = new Date(breakStart);
    breakEnd.setMinutes(breakEnd.getMinutes() + breakDurationMinutes);

    setIsBreakActive(now >= breakStartWithTolerance && now <= breakEnd);

    const today = now.toDateString();
    const storedTickets =
      JSON.parse(await AsyncStorage.getItem("ticketsHoje")) || [];
    const todayTicket = storedTickets.find(
      (t) =>
        t.date === today && t.aluno && t.aluno.matricula === aluno.matricula
    );

    setHasTicketToday(!!todayTicket);
  };

  useEffect(() => {
    checkEligibility();
    const interval = setInterval(checkEligibility, 10000);
    return () => clearInterval(interval);
  }, []);

  const getDistanceFromLatLonInM = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
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

  const receiveTicket = async () => {
    const aluno = JSON.parse(await AsyncStorage.getItem("user"));
    if (!aluno) return Alert.alert("Erro", "Aluno não Encontrado.");

    if (!isBreakActive)
      return Alert.alert("Erro", "Ainda não é Horário do Intervalo.");

    const storedTickets =
      JSON.parse(await AsyncStorage.getItem("ticketsHoje")) || [];
    const today = new Date().toDateString();
    if (
      storedTickets.some(
        (t) => t.date === today && t.aluno.matricula === aluno.matricula
      )
    )
      return Alert.alert("Erro", "Você já Resgatou um Ticket Hoje.");

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted")
      return Alert.alert("Erro", "Não foi Possível Acessar a Localização.");

    const location = await Location.getCurrentPositionAsync({});
    const distance = getDistanceFromLatLonInM(
      location.coords.latitude,
      location.coords.longitude,
      allowedCoords.latitude,
      allowedCoords.longitude
    );
    if (distance > allowedRadius)
      return Alert.alert("Erro", "Fora da Área Permitida.");

    setInRegion(true);

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

  let bgSource;
  try {
    bgSource = require("../assets/planodefundo.jpeg");
  } catch (e) {
    bgSource = { uri: planoDataUri };
  }

  return (
    <ImageBackground source={bgSource} style={{ flex: 1 }} resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.header}>Receber Ticket</Text>
        <Text style={styles.status}>
          Região: {inRegion ? "Dentro da Escola" : "Fora da Escola"}
        </Text>

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
