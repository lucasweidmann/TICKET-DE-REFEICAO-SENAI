import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function BreakScreen() {
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
      breakStart.setHours(15, 0, 0, 0);

      const breakEnd = new Date();
      breakEnd.setHours(15, 15, 0, 0);

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
    <View style={styles.container}>
      <Text style={styles.header}>
        {isBreakActive ? "Intervalo Ativo" : "Intervalo Inativo"}
      </Text>
      <Text style={styles.timerText}>
        {isBreakActive ? "Tempo Restante:" : "Tempo até o Início:"}{" "}
        {remainingTime}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  timerText: { fontSize: 20, fontWeight: "500", color: "#000" },
});
