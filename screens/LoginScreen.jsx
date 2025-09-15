import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

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

    navigation.replace("AppDrawer"); // vai para Drawer
  };

  const handleLoginAdmin = async () => {
    const admin = { usuario: "admin", senha: "1234" };
    if (matricula === admin.usuario && senha === admin.senha) {
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({ tipo: "admin", usuario: matricula })
      );
      navigation.replace("ADM"); // vai para tela ADM
    } else {
      Alert.alert("Erro", "Usuário ou senha incorretos");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TELA DE LOGIN</Text>

      <TextInput
        placeholder="Matrícula do Aluno / Usuário do ADM"
        value={matricula}
        onChangeText={setMatricula}
        style={styles.input}
      />

      <TextInput
        placeholder="Senha (APENAS ADM)"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Login Aluno" onPress={handleLoginAluno} />
      <Button title="Login ADM" onPress={handleLoginAdmin} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      marginBottom: 15,
      padding: 10,
      borderRadius: 5,
    },
});
