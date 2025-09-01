import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import * as Location from "expo-location";

const TARGET_COORDS = {
  latitude: -27.618405420275778,
  longitude: -48.66326061586043,
  radius: 20, // metros
};
const MARGIN = 0.5; // tolerância para pequenas variações do GPS

export default function TicketReceiptScreen() {
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
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

      // Pega localização com maior precisão possível
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocation(loc.coords);

      const distance = getDistance(
        loc.coords.latitude,
        loc.coords.longitude,
        TARGET_COORDS.latitude,
        TARGET_COORDS.longitude
      );

      // Verifica se está dentro do limite com margem de tolerância
      if (distance <= TARGET_COORDS.radius + MARGIN) {
        setMessage("Você está no SENAI e pode receber o ticket!");
      } else {
        setMessage("Você está fora do SENAI e não pode receber o ticket.");
      }
    })();
  }, []);

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
      <Text style={styles.title}>Receber Ticket</Text>
      {location ? (
        <>
          <Text style={styles.text}>
            Latitude: {location.latitude.toFixed(6)}
            {"\n"}
            Longitude: {location.longitude.toFixed(6)}
          </Text>
          <Text style={[styles.text, { marginTop: 10, fontWeight: "bold" }]}>
            {message}
          </Text>
        </>
      ) : (
        <Text style={styles.text}>Obtendo localização...</Text>
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
  title: { fontSize: 24, marginBottom: 20 },
  text: { textAlign: "center", fontSize: 16 },
});
