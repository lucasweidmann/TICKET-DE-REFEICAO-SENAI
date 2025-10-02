import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import Theme from "./styles/ThemeStyles";
import { useNavigation } from "@react-navigation/native";
import planoDataUri from "../assets/planodefundo";

export default function LoginChoiceScreen() {
  const navigation = useNavigation();

  let bgSource;
  try {
    bgSource = require("../assets/planodefundo.jpeg");
  } catch (e) {
    bgSource = { uri: planoDataUri };
  }

  return (
    <ImageBackground source={bgSource} style={styles.bg} imageStyle={styles.image} resizeMode="cover" blurRadius={3}>
    <View style={styles.overlay} />
    <View style={[Theme.container, { justifyContent: "center", alignItems: "center", backgroundColor: 'transparent' }]}> 
        <Text style={Theme.header}>Você quer logar como:</Text>

        <View style={{ marginVertical: 10 }}>
          <TouchableOpacity style={Theme.button} onPress={() => navigation.navigate("LoginAluno")} activeOpacity={0.8}>
            <Text style={Theme.buttonText}>Aluno</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginVertical: 10 }}>
          <TouchableOpacity style={Theme.button} onPress={() => navigation.navigate("LoginAdmin")} activeOpacity={0.8}>
            <Text style={Theme.buttonText}>Admin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', transform: [{ scale: 1.03 }] },
  image: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.32)'
  }
});
