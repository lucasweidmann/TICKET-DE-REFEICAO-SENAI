import React from "react";
import { View, Text, Button } from "react-native";
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
        <Button
          title="Aluno"
          onPress={() => navigation.navigate("LoginAluno")}
        />
      </View>

      <View style={{ marginVertical: 10 }}>
        <Button
          title="Admin"
          onPress={() => navigation.navigate("LoginAdmin")}
        />
      </View>
    </View>
  );
}
