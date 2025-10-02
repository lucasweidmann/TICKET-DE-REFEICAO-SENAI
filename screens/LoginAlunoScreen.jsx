import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Theme from "./styles/ThemeStyles";
import planoDataUri from "../assets/planodefundo";

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

  let bgSource;
  try {
    bgSource = require("../assets/planodefundo.jpeg");
  } catch (e) {
    bgSource = { uri: planoDataUri };
  }

  return (
    <ImageBackground source={bgSource} style={styles.bg} resizeMode="cover" blurRadius={3}>
      <View style={styles.overlay} />
      <View style={[Theme.container, { justifyContent: "center", backgroundColor: 'transparent' }]}> 
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

        <TouchableOpacity style={Theme.button} onPress={handleLoginAluno} activeOpacity={0.8}>
          <Text style={Theme.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', transform: [{ scale: 1.03 }] },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.32)' }
});
