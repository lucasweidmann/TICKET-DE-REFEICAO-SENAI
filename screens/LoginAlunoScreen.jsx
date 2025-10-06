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

// Tela de login para alunos
export default function LoginAlunoScreen() {
  const navigation = useNavigation(); // Hook para navegação entre telas
  const [codigo, setCodigo] = useState(""); // Armazena o código digitado pelo aluno

  // Função principal: valida o código e autentica o aluno
  const handleLoginAluno = async () => {
    // Busca lista de alunos cadastrados no AsyncStorage
    const alunos = JSON.parse(await AsyncStorage.getItem("alunos")) || [];

    // Procura o aluno pelo código informado
    const aluno = alunos.find((a) => a.codigo === codigo);

    // Se não encontrado, exibe alerta de erro
    if (!aluno) return Alert.alert("Erro", "Código Inválido");

    // Salva o usuário atual (aluno logado) no AsyncStorage
    await AsyncStorage.setItem(
      "user",
      JSON.stringify({ tipo: "aluno", ...aluno })
    );

    // Redireciona para a área principal do app (Drawer)
    navigation.replace("AppDrawer");
  };

  // Controle da imagem de fundo (fallback caso o arquivo local falhe)
  let bgSource;
  try {
    bgSource = require("../assets/planodefundo.jpeg");
  } catch (e) {
    bgSource = { uri: planoDataUri };
  }

  // Interface do login
  return (
    <ImageBackground source={bgSource} style={{ flex: 1 }} resizeMode="cover">
      <View style={styles.container}>
        {/* Título da tela */}
        <Text style={styles.header}>Login Aluno</Text>

        {/* Campo para digitar o código do aluno */}
        <TextInput
          placeholder="Código"
          value={codigo}
          onChangeText={setCodigo}
          style={styles.input}
        />

        {/* Botão de login que dispara a validação */}
        <TouchableOpacity style={styles.button} onPress={handleLoginAluno}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// Estilos visuais da tela
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
