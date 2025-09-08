import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

export default function TicketReceiptScreen() {
  const [isNearBreak, setIsNearBreak] = useState(false);
  const [hasTicketToday, setHasTicketToday] = useState(false);
  const [inRegion, setInRegion] = useState(false);

  // localização da escola
  const allowedCoords = {
    latitude: -27.61838134931327,
    longitude: -48.66277801339434,
  };
  const allowedRadius = 100; // metros

  const breakStartHour = 15;
  const breakStartMinute = 30;

  useEffect(() => {
    const checkEligibility = async () => {
      const now = new Date();

      // horário do intervalo
      const breakStart = new Date();
      breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);

      const diffMs = breakStart - now;
      const diffMinutes = diffMs / 1000 / 60;

      setIsNearBreak(diffMinutes <= 5 && diffMinutes >= 0);

      // ticket do dia
      const today = now.toDateString();
      const stored = JSON.parse(await AsyncStorage.getItem("ticketHoje"));
      setHasTicketToday(stored && stored.date === today);
    };

    checkEligibility();
    const interval = setInterval(checkEligibility, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  // utilitário: distância em metros entre duas coordenadas
  const getDistanceFromLatLonInM = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // valida localização e recebe ticket
  const receiveTicket = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Não foi possível acessar a localização");
      return;
    }

    const current = await Location.getCurrentPositionAsync({});
    const distance = getDistanceFromLatLonInM(
      current.coords.latitude,
      current.coords.longitude,
      allowedCoords.latitude,
      allowedCoords.longitude
    );

    const insideRegion = distance <= allowedRadius;
    setInRegion(insideRegion);

    if (!insideRegion) {
      return Alert.alert("Erro", "Você não está dentro da região permitida");
    }
    if (!isNearBreak) {
      return Alert.alert("Erro", "Ainda não é horário para receber ticket");
    }
    if (hasTicketToday) {
      return Alert.alert("Erro", "Você já recebeu um ticket hoje");
    }

    // pega dados do aluno logado
    const aluno = JSON.parse(await AsyncStorage.getItem("user"));

    const today = new Date().toDateString();
    await AsyncStorage.setItem(
      "ticketHoje",
      JSON.stringify({
        date: today,
        used: false,
        aluno: aluno ? { nome: aluno.nome, matricula: aluno.matricula } : null,
      })
    );

    setHasTicketToday(true);
    Alert.alert("Sucesso", "Ticket recebido!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receber Ticket</Text>

      <Text style={styles.info}>
        Região: {inRegion ? "Dentro da Escola" : "Fora da Escola"}
      </Text>

      <View style={{ marginVertical: 20 }}>
        {hasTicketToday ? (
          <Text style={styles.success}>Status: Ticket disponível</Text>
        ) : isNearBreak ? (
          <Button title="Receber Ticket" onPress={receiveTicket} />
        ) : (
          <Text style={styles.waiting}>Aguardando horário do intervalo...</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 22, marginBottom: 20, fontWeight: "bold" },
  info: { fontSize: 16, marginVertical: 10 },
  waiting: { fontSize: 16, color: "gray" },
  success: { fontSize: 18, color: "green", fontWeight: "bold" },
});
