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

// Tela de login do administrador
export default function LoginAdminScreen() {
  const navigation = useNavigation(); // Controle de navegação entre telas
  const [usuario, setUsuario] = useState(""); // Armazena o nome de usuário digitado
  const [senha, setSenha] = useState(""); // Armazena a senha digitada

  // Função principal: valida credenciais do admin
  const handleLoginAdmin = async () => {
    // Credenciais fixas do administrador
    const admin = { usuario: "admin", senha: "1234" };

    // Verifica se os dados inseridos são válidos
    if (usuario === admin.usuario && senha === admin.senha) {
      // Salva dados do usuário logado no AsyncStorage
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({ tipo: "admin", usuario })
      );

      // Redireciona para o painel administrativo
      navigation.replace("AdmDrawer");
    } else {
      // Exibe alerta em caso de erro de login
      Alert.alert("Erro", "Usuário ou Senha Incorretos");
    }
  };

  // Controle da imagem de fundo (usa fallback se não encontrar o arquivo)
  let bgSource;
  try {
    bgSource = require("../assets/planodefundo.jpeg");
  } catch (e) {
    bgSource = { uri: planoDataUri };
  }

  // Interface visual da tela
  return (
    <ImageBackground source={bgSource} style={{ flex: 1 }} resizeMode="cover">
      <View style={styles.container}>
        {/* Título da tela */}
        <Text style={styles.header}>Login Admin</Text>

        {/* Campo de texto para o nome de usuário */}
        <TextInput
          placeholder="Usuário"
          value={usuario}
          onChangeText={setUsuario}
          style={styles.input}
        />

        {/* Campo de senha com ocultação de caracteres */}
        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
        />

        {/* Botão de login que chama a função de validação */}
        <TouchableOpacity style={styles.button} onPress={handleLoginAdmin}>
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
