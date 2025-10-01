import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Button, TouchableOpacity, Text } from "react-native";

import LoginChoiceScreen from "./screens/LoginChoiceScreen";
import LoginAlunoScreen from "./screens/LoginAlunoScreen";
import LoginAdminScreen from "./screens/LoginADMSCreen";
import ADMScreen from "./screens/ADMScreen";
import BreakScreen from "./screens/BreakScreen";
import TicketReceiptScreen from "./screens/TicketReceiptScreen";
import TicketValidationScreen from "./screens/TicketValidationScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AlunoDrawer({ navigation }) {
  return (
    <Drawer.Navigator
      initialRouteName="Break"
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.replace("LoginChoice")} style={{ marginRight: 10 }} activeOpacity={0.8}>
            <Text style={{ color: '#000000ff', fontWeight: 'bold' }}>Sair</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="Break"
        component={BreakScreen}
        options={{ title: "Tempo até o Intervalo" }}
      />
      <Drawer.Screen
        name="TicketReceipt"
        component={TicketReceiptScreen}
        options={{ title: "Receber Ticket" }}
      />
    </Drawer.Navigator>
  );
}

function AdmDrawer({ navigation }) {
  return (
    <Drawer.Navigator
      initialRouteName="ADM"
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.replace("LoginChoice")} style={{ marginRight: 10 }} activeOpacity={0.8}>
            <Text style={{ color: '#000000ff', fontWeight: 'bold' }}>Sair</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="ADM"
        component={ADMScreen}
        options={{ title: "Gerenciar Alunos" }}
      />
      <Drawer.Screen
        name="TicketValidation"
        component={TicketValidationScreen}
        options={{ title: "Validar Ticket" }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginChoice"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LoginChoice" component={LoginChoiceScreen} />
        <Stack.Screen name="LoginAluno" component={LoginAlunoScreen} />
        <Stack.Screen name="LoginAdmin" component={LoginAdminScreen} />
        <Stack.Screen name="AppDrawer" component={AlunoDrawer} />
        <Stack.Screen name="AdmDrawer" component={AdmDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
