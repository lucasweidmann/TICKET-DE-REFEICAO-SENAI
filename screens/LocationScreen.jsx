// 6. Tela de Localização
// Verifica a localização do aluno usando expo-location.
// Só permite pegar ticket se o aluno estiver dentro da coordenada definida (ex: simular localização da escola).

import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SCHOOL_COORDS = {
  latitude: -23.561684,
  longitude: -46.625378,
  radius: 100, // metros
};

export default function LocationScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === "granted");
      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Precisamos da sua localização para continuar"
        );
        return;
      }
    })();
  }, []);

  const checkLocation = async () => {
    if (!hasPermission) return;

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);

    const distance = getDistance(
      loc.coords.latitude,
      loc.coords.longitude,
      SCHOOL_COORDS.latitude,
      SCHOOL_COORDS.longitude
    );

    if (distance <= SCHOOL_COORDS.radius) {
      Alert.alert("Sucesso", "Você está na região permitida");
      navigation.navigate("Ticket");
    } else {
      Alert.alert(
        "Fora da área",
        "Você precisa estar na escola para pegar o ticket"
      );
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // distância em metros
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Localização</Text>
      <Button title="Verificar localização" onPress={checkLocation} />
      {location && (
        <Text style={styles.text}>
          Latitude: {location.latitude.toFixed(6)}
          {"\n"}
          Longitude: {location.longitude.toFixed(6)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  text: { marginTop: 20, textAlign: "center" },
});