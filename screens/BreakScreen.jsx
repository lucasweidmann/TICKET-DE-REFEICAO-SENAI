import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const BreakScreen = () => {
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");

<<<<<<< HEAD
  const breakStartTime = new Date();
  breakStartTime.setHours(15, 0, 0);
  const breakEndTime = new Date();
  breakEndTime.setHours(15, 15, 0);

=======
>>>>>>> refs/remotes/origin/main
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
  
      const breakStartTime = new Date();
      breakStartTime.setHours(16, 26, 0);
  
      const breakEndTime = new Date();
      breakEndTime.setHours(16, 28, 0);
  
      if (now >= breakStartTime && now <= breakEndTime) {
        setIsBreakActive(true);
        const timeLeft = Math.floor((breakEndTime - now) / 1000);
        setRemainingTime(`${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`);
      } else {
        setIsBreakActive(false);
        const timeUntilStart = Math.floor((breakStartTime - now) / 1000);
        setRemainingTime(
          timeUntilStart > 0
            ? `${Math.floor(timeUntilStart / 60)}m ${timeUntilStart % 60}s`
            : "00:00"
        );
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
