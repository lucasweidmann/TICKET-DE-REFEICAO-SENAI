import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Theme from "./styles/ThemeStyles";
import { useNavigation } from "@react-navigation/native";

export default function LoginChoiceScreen() {
  const navigation = useNavigation();

  return (
    <View
      style={[
        Theme.container,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <Text style={Theme.header}>Você quer logar como:</Text>

      <View style={{ marginVertical: 10 }}>
        <TouchableOpacity style={Theme.button} onPress={() => navigation.navigate("LoginAluno")} activeOpacity={0.8}>
          <Text style={Theme.buttonText}>Aluno</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginVertical: 10 }}>
        <TouchableOpacity style={Theme.button} onPress={() => navigation.navigate("LoginAdmin")} activeOpacity={0.8}>
          <Text style={Theme.buttonText}>Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
