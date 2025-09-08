import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

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

      // intervalo de hoje
      const breakStart = new Date();
      breakStart.setHours(15, 15, 0, 0);

      const breakEnd = new Date();
      breakEnd.setHours(15, 30, 0, 0);

      if (now >= breakStart && now <= breakEnd) {
        // estamos dentro do intervalo
        setIsBreakActive(true);
        const timeLeft = Math.floor((breakEnd - now) / 1000);
        setRemainingTime(formatTime(timeLeft));
      } else {
        // estamos fora do intervalo → calcula tempo até o próximo início
        setIsBreakActive(false);

        // se já passou do fim de hoje, usa amanhã
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
    <View style={styles.container}>
      <Text style={styles.title}>
        {isBreakActive ? "Intervalo Ativo" : "Intervalo Inativo"}
      </Text>
      <Text style={styles.time}>
        {isBreakActive ? "Tempo restante:" : "Tempo até o início:"}{" "}
        {remainingTime}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
  time: { fontSize: 18 },
});

export default BreakScreen;
