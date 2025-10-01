import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Theme from "./styles/ThemeStyles";

export default function LoginAlunoScreen() {
  const navigation = useNavigation();
  const [matricula, setMatricula] = useState("");
  const [codigo, setCodigo] = useState("");

  const handleLoginAluno = async () => {
    const alunos = JSON.parse(await AsyncStorage.getItem("alunos")) || [];
    const aluno = alunos.find(
      (a) => a.matricula === matricula && a.codigo === codigo
    );

    if (!aluno) return Alert.alert("Erro", "Matrícula ou código inválidos");

    await AsyncStorage.setItem(
      "user",
      JSON.stringify({ tipo: "aluno", ...aluno })
    );
    navigation.replace("AppDrawer");
  };

  return (
    <View style={[Theme.container, { justifyContent: "center" }]}>
      <Text style={Theme.header}>Login Aluno</Text>

      <TextInput
        placeholder="Matrícula"
        value={matricula}
        onChangeText={setMatricula}
        style={Theme.input}
      />

      <TextInput
        placeholder="Código"
        value={codigo}
        onChangeText={setCodigo}
        style={Theme.input}
      />

      <Button title="Login" onPress={handleLoginAluno} />
    </View>
  );
}
