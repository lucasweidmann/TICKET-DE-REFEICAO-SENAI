import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Theme from "./styles/ThemeStyles";

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

  return (
    <View style={[Theme.container, { justifyContent: "center" }]}>
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
  );
}
