import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import Theme from "./styles/ThemeStyles";

export default function TicketValidationScreen() {
  const [ticketsHoje, setTicketsHoje] = useState([]);
  const allowedCoords = {
    latitude: -27.61838134931327,
    longitude: -48.66277801339434,
  };
  const allowedRadius = 100;

  const loadTickets = async () => {
    const today = new Date().toDateString();
    const stored = JSON.parse(await AsyncStorage.getItem("ticketsHoje")) || [];
    const filtered = stored.filter(t => t.date === today);
    setTicketsHoje(filtered);
  };

  useEffect(() => {
    loadTickets();
  }, []);

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

  const validateTicket = async (ticket) => {
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
      return Alert.alert("Erro", "Você não está na região permitida");
    }

    const allTickets = JSON.parse(await AsyncStorage.getItem("ticketsHoje")) || [];
    const newTickets = allTickets.filter(t => t.aluno.matricula !== ticket.aluno.matricula);
    await AsyncStorage.setItem("ticketsHoje", JSON.stringify(newTickets));

    Alert.alert("Sucesso", `Ticket do aluno ${ticket.aluno.nome} validado!`);
    loadTickets();
  };


  return (
    <View style={Theme.container}>
      <Text style={Theme.header}>Validação de Tickets</Text>
      {ticketsHoje.length === 0 ? (
        <Text style={Theme.cardText}>Nenhum ticket registrado hoje</Text>
      ) : (
        <FlatList
          data={ticketsHoje}
          keyExtractor={(item) => item.aluno.matricula}
          renderItem={({ item }) => (
            <View style={Theme.card}>
              <Text style={Theme.cardText}>Nome: {item.aluno.nome}</Text>
              <Text style={Theme.cardText}>Matrícula: {item.aluno.matricula}</Text>
              <TouchableOpacity style={Theme.button} onPress={() => validateTicket(item)} activeOpacity={0.8}>
                <Text style={Theme.buttonText}>Validar Ticket</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
