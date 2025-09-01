import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

const SCHOOL_COORDS = {
  latitude: -23.561684,
  longitude: -46.625378,
  radius: 100, // metros
};

export default function LocationScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === "granted");

      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Precisamos da sua localização para continuar"
        );
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      const addr = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (addr.length > 0) setAddress(addr[0]);

      setLoading(false);
    })();
  }, []);

  const checkLocation = () => {
    if (!hasPermission || !location) return;

    const distance = getDistance(
      location.latitude,
      location.longitude,
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

    return R * c;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Você está aqui"
            />
          </MapView>
          <Text style={styles.text}>
            {address
              ? `${address.name || ""}, ${address.street || ""}, ${
                  address.city || ""
                }`
              : "Endereço não disponível"}
          </Text>
          <Button
            title="Verificar proximidade da escola"
            onPress={checkLocation}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  text: { textAlign: "center", padding: 10, fontSize: 16 },
});
