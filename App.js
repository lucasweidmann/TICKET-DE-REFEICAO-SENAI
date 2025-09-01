import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LoginScreen from "./screens/LoginScreen";
import ADMScreen from "./screens/ADMScreen";
import BreakScreen from "./screens/BreakScreen";
import LocationScreen from "./screens/LocationScreen"; // adicionado

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AppDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Location">
      <Drawer.Screen
        name="Location"
        component={LocationScreen}
        options={{ title: "Localização" }}
      />
      <Drawer.Screen
        name="Break"
        component={BreakScreen}
        options={{ title: "Pausa" }}
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
