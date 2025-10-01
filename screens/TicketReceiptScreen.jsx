import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import Theme from "./styles/ThemeStyles";

export default function TicketReceiptScreen() {
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [hasTicketToday, setHasTicketToday] = useState(false);
  const [inRegion, setInRegion] = useState(false);

  const allowedCoords = { latitude: -27.61838134931327, longitude: -48.66277801339434 };
  const allowedRadius = 100;

  const breakStartHour = 16;
  const breakStartMinute = 10;
  const breakDurationMinutes = 15;

  const checkEligibility = async () => {
    const aluno = JSON.parse(await AsyncStorage.getItem("user"));
    if (!aluno) return;

    const now = new Date();
    const breakStart = new Date();
    breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);

    const breakEnd = new Date(breakStart);
    breakEnd.setMinutes(breakEnd.getMinutes() + breakDurationMinutes);

    setIsBreakActive(now >= breakStart && now <= breakEnd);

    const today = now.toDateString();
    const storedTickets = JSON.parse(await AsyncStorage.getItem("ticketsHoje")) || [];

    const todayTicket = storedTickets.find(
      t => t.date === today && t.aluno && t.aluno.matricula === aluno.matricula
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
    if (!aluno) return Alert.alert("Erro", "Aluno não encontrado.");

    if (!isBreakActive) return Alert.alert("Erro", "Ainda não é horário do intervalo.");

    const storedTickets = JSON.parse(await AsyncStorage.getItem("ticketsHoje")) || [];
    const today = new Date().toDateString();

    const alreadyReceived = storedTickets.some(
      t => t.date === today && t.aluno.matricula === aluno.matricula
    );
    if (alreadyReceived) return Alert.alert("Erro", "Você já resgatou um ticket hoje.");

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("Permissão negada", "Não foi possível acessar a localização.");
    }

    const location = await Location.getCurrentPositionAsync({});
    const distance = getDistanceFromLatLonInM(
      location.coords.latitude,
      location.coords.longitude,
      allowedCoords.latitude,
      allowedCoords.longitude
    );

    if (distance > allowedRadius) return Alert.alert("Erro", "Você não está dentro da área permitida.");
    setInRegion(distance <= allowedRadius);

    const newTicket = { date: today, used: false, aluno: { nome: aluno.nome, matricula: aluno.matricula } };
    await AsyncStorage.setItem("ticketsHoje", JSON.stringify([...storedTickets, newTicket]));

    setHasTicketToday(true);
    Alert.alert("Sucesso", "Ticket recebido!");
  };


  return (
    <View style={[Theme.container, { alignItems: "center", justifyContent: "center" }]}> 
      <Text style={Theme.header}>Receber Ticket</Text>
      <Text style={[Theme.cardText, { marginVertical: 10 }]}>Região: {inRegion ? "Dentro da Escola" : "Fora da Escola"}</Text>

      <View style={{ marginVertical: 20 }}>
        {hasTicketToday ? (
          <Text style={[Theme.cardText, { color: "green", fontWeight: "bold", fontSize: 18 }]}>Status: Ticket já registrado hoje</Text>
          ) : isBreakActive ? (
          <TouchableOpacity style={Theme.button} onPress={receiveTicket} activeOpacity={0.8}>
            <Text style={Theme.buttonText}>Receber Ticket</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[Theme.cardText, { color: "gray" }]}>Aguardando horário do intervalo...</Text>
        )}
      </View>
    </View>
  );
}
