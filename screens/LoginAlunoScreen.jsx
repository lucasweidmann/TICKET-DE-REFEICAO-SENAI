import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import planoDataUri from "../assets/planodefundo";

export default function LoginAlunoScreen() {
  const navigation = useNavigation();
  const [codigo, setCodigo] = useState("");

  const handleLoginAluno = async () => {
    const alunos = JSON.parse(await AsyncStorage.getItem("alunos")) || [];
    const aluno = alunos.find((a) => a.codigo === codigo);
    if (!aluno) return Alert.alert("Erro", "Código Inválido");

    await AsyncStorage.setItem(
      "user",
      JSON.stringify({ tipo: "aluno", ...aluno })
    );
    navigation.replace("AppDrawer");
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
        <Text style={styles.header}>Login Aluno</Text>
        <TextInput
          placeholder="Código"
          value={codigo}
          onChangeText={setCodigo}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleLoginAluno}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
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
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#000",
    marginBottom: 12,
    width: "100%",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
    width: "100%",
  },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
