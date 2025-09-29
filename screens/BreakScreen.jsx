import React, { useState, useEffect } from "react";

import { View, Text } from "react-native";
import Theme from "./styles/ThemeStyles";

const BreakScreen = () => {
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      const breakStart = new Date();
      breakStart.setHours(16, 10, 0, 0);

      const breakEnd = new Date();
      breakEnd.setHours(16, 15, 0, 0);

      if (now >= breakStart && now <= breakEnd) {
        setIsBreakActive(true);
        const timeLeft = Math.floor((breakEnd - now) / 1000);
        setRemainingTime(formatTime(timeLeft));
      } else {
        setIsBreakActive(false);

        if (now > breakEnd) {
          breakStart.setDate(breakStart.getDate() + 1);
        }

        const timeUntilStart = Math.floor((breakStart - now) / 1000);
        setRemainingTime(formatTime(timeUntilStart));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[Theme.container, { justifyContent: "center", alignItems: "center" }]}> 
      <Text style={Theme.header}>
        {isBreakActive ? "Intervalo Ativo" : "Intervalo Inativo"}
      </Text>
      <Text style={[Theme.cardText, { fontSize: 18 }]}> 
        {isBreakActive ? "Tempo restante:" : "Tempo até o início:"} {remainingTime}
      </Text>
    </View>
  );
};

export default BreakScreen;
