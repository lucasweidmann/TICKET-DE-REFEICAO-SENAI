import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Button } from "react-native";

import LoginScreen from "./screens/LoginScreen";
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
          <Button title="Sair" onPress={() => navigation.replace("Login")} />
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
          <Button title="Sair" onPress={() => navigation.replace("Login")} />
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
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AppDrawer" component={AlunoDrawer} />
        <Stack.Screen name="AdmDrawer" component={AdmDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
