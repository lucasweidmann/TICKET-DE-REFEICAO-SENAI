import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Theme from "./styles/ThemeStyles";
import planoDataUri from "../assets/planodefundo";

export default function LoginAdminScreen() {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const handleLoginAdmin = async () => {
    const admin = { usuario: "admin", senha: "1234" };
    if (usuario === admin.usuario && senha === admin.senha) {
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({ tipo: "admin", usuario })
      );
      navigation.replace("AdmDrawer");
    } else {
      Alert.alert("Erro", "Usuário ou senha incorretos");
    }
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
        <Text style={Theme.header}>Login Admin</Text>
        <TextInput
          placeholder="Usuário"
          value={usuario}
          onChangeText={setUsuario}
          style={Theme.input}
        />
        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={Theme.input}
        />
        <TouchableOpacity style={Theme.button} onPress={handleLoginAdmin} activeOpacity={0.8}>
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
