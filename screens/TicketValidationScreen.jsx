import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

export default function TicketValidationScreen() {
  const [aluno, setAluno] = useState(null);
  const [ticketStatus, setTicketStatus] = useState("Carregando...");

  // localização da escola
  const allowedCoords = {
    latitude: -27.61838134931327,
    longitude: -48.66277801339434,
  };
  const allowedRadius = 100; // metros

  useEffect(() => {
    const loadData = async () => {
      const user = JSON.parse(await AsyncStorage.getItem("user"));
      if (user && user.tipo === "aluno") {
        setAluno(user);
      }

      const ticket = JSON.parse(await AsyncStorage.getItem("ticketHoje"));
      const today = new Date().toDateString();

      if (!ticket || ticket.date !== today) {
        setTicketStatus("Nenhum ticket emitido");
      } else if (ticket.used) {
        setTicketStatus("Ticket já usado");
      } else {
        setTicketStatus("Ticket disponível");
      }
    };

    loadData();
  }, []);

  // função utilitária: distância em metros entre duas coordenadas
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

  const validateTicket = async () => {
    // checa localização
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

    if (distance > allowedRadius) {
      return Alert.alert("Erro", "Aluno não está na região permitida");
    }

    const ticket = JSON.parse(await AsyncStorage.getItem("ticketHoje"));
    const today = new Date().toDateString();

    if (!ticket || ticket.date !== today) {
      return Alert.alert("Erro", "Nenhum ticket válido encontrado");
    }
    if (ticket.used) {
      return Alert.alert("Erro", "Ticket já foi usado");
    }

    // marca como usado
    await AsyncStorage.setItem(
      "ticketHoje",
      JSON.stringify({ ...ticket, used: true })
    );

    setTicketStatus("Ticket já usado");
    Alert.alert("Sucesso", "Ticket validado com sucesso!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Validação de Ticket</Text>

      {aluno ? (
        <View style={styles.infoBox}>
          <Text style={styles.info}>Nome: {aluno.nome}</Text>
          <Text style={styles.info}>Matrícula: {aluno.matricula}</Text>
        </View>
      ) : (
        <Text style={styles.info}>Nenhum aluno logado</Text>
      )}

      <Text style={styles.status}>Status: {ticketStatus}</Text>

      {ticketStatus === "Ticket disponível" && (
        <Button title="Validar Ticket" onPress={validateTicket} />
      )}
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
  infoBox: { marginBottom: 20 },
  info: { fontSize: 16 },
  status: { fontSize: 18, marginVertical: 20, fontWeight: "bold" },
});
