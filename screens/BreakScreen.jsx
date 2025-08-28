import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const BreakScreen = () => {
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");

  const getNextBreakTime = (hours, minutes) => {
    const now = new Date();
    const breakTime = new Date();
    breakTime.setHours(hours, minutes, 0, 0);
    if (breakTime < now) {
      breakTime.setDate(breakTime.getDate() + 1);
    }
    return breakTime;
  };

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const breakStartTime = getNextBreakTime(15, 30);
      const breakEndTime = getNextBreakTime(15, 45);
      if (now >= breakStartTime && now <= breakEndTime) {
        setIsBreakActive(true);
        const timeLeft = Math.floor((breakEndTime - now) / 1000);
        setRemainingTime(formatTime(timeLeft));
      } else {
        setIsBreakActive(false);
        const timeUntilStart = Math.floor((breakStartTime - now) / 1000);
        setRemainingTime(formatTime(timeUntilStart > 0 ? timeUntilStart : 0));
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
        {isBreakActive ? "Tempo restante:" : "Tempo até o início:"} {remainingTime}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
  time: { fontSize: 18 }
});

export default BreakScreen;
