import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import LoginScreen from "./screens/LoginScreen";
import ADMScreen from "./screens/ADMScreen";
import BreakScreen from "./screens/BreakScreen";
import TicketReceiptScreen from "./screens/TicketReceiptScreen";
import TicketValidationScreen from "./screens/TicketValidationScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer sem a tela de Location
function AppDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Break">
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
        <Stack.Screen name="ADM" component={ADMScreen} />
        <Stack.Screen name="AppDrawer" component={AppDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
