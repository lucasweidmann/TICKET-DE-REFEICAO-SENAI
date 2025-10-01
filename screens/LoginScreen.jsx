import React, { useState } from "react";

import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Theme from "./styles/ThemeStyles";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");

  const handleLoginAluno = async () => {
    const alunos = JSON.parse(await AsyncStorage.getItem("alunos")) || [];
    const aluno = alunos.find((a) => a.matricula === matricula);

    if (!aluno) return Alert.alert("Erro", "Matrícula inválida");

    await AsyncStorage.setItem(
      "user",
      JSON.stringify({ tipo: "aluno", ...aluno })
    );

    navigation.replace("AppDrawer");
  };

  const handleLoginAdmin = async () => {
    const admin = { usuario: "admin", senha: "1234" };
    if (matricula === admin.usuario && senha === admin.senha) {
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({ tipo: "admin", usuario: matricula })
      );
      navigation.replace("AdmDrawer");
    } else {
      Alert.alert("Erro", "Usuário ou senha incorretos");
    }
  };
  


  return (
    <View style={[Theme.container, { justifyContent: "center" }]}> 
      <Text style={Theme.header}>TELA DE LOGIN</Text>

      <TextInput
        placeholder="Matrícula do Aluno / Usuário do ADM"
        value={matricula}
        onChangeText={setMatricula}
        style={Theme.input}
      />

      <TextInput
        placeholder="Senha (APENAS ADM)"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={Theme.input}
      />

      <TouchableOpacity
        style={[Theme.button, { marginBottom: 10 }]}
        onPress={handleLoginAluno}
        activeOpacity={0.8}
      >
        <Text style={[Theme.buttonText, { textTransform: "none" }]}>aluno</Text>
      </TouchableOpacity>

      <TouchableOpacity style={Theme.button} onPress={handleLoginAdmin} activeOpacity={0.8}>
        <Text style={[Theme.buttonText, { textTransform: "none" }]}>admin</Text>
      </TouchableOpacity>
    </View>
  );
}
