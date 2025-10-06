import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import planoDataUri from "../assets/planodefundo";

// Tela de escolha de tipo de login (Aluno ou Admin)
export default function LoginChoiceScreen() {
  const navigation = useNavigation(); // Hook para navegação entre telas

  // Controle da imagem de fundo (fallback se o arquivo local falhar)
  let bgSource;
  try {
    bgSource = require("../assets/planodefundo.jpeg");
  } catch (e) {
    bgSource = { uri: planoDataUri };
  }

  return (
    // Fundo da tela com imagem personalizada
    <ImageBackground source={bgSource} style={{ flex: 1 }} resizeMode="cover">
      <View style={styles.container}>
        {/* Título principal */}
        <Text style={styles.header}>Entrar como:</Text>

        {/* Botão que leva à tela de login do aluno */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("LoginAluno")}
        >
          <Text style={styles.buttonText}>Aluno</Text>
        </TouchableOpacity>

        {/* Botão que leva à tela de login do administrador */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("LoginAdmin")}
        >
          <Text style={styles.buttonText}>Admin</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Centraliza verticalmente
    alignItems: "center", // Centraliza horizontalmente
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
