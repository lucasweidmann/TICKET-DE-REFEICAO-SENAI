import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

// Tela que exibe o status do intervalo (ativo ou inativo)
export default function BreakScreen() {
  // Estado que controla se o intervalo está ativo
  const [isBreakActive, setIsBreakActive] = useState(false);

  // Estado que guarda o tempo restante (ou tempo até o início)
  const [remainingTime, setRemainingTime] = useState("");

  // Função auxiliar: converte segundos em formato "h m s"
  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // useEffect executa a cada segundo para atualizar o status do intervalo
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      // Define início e fim fixos do intervalo (15:00 às 15:15)
      const breakStart = new Date();
      breakStart.setHours(15, 0, 0, 0);

      const breakEnd = new Date();
      breakEnd.setHours(15, 15, 0, 0);

      // Verifica se o horário atual está dentro do intervalo
      if (now >= breakStart && now <= breakEnd) {
        setIsBreakActive(true);

        // Calcula tempo restante até o final do intervalo
        const timeLeft = Math.floor((breakEnd - now) / 1000);
        setRemainingTime(formatTime(timeLeft));
      } else {
        setIsBreakActive(false);

        // Se já passou do horário de hoje, ajusta para o próximo dia
        if (now > breakEnd) {
          breakStart.setDate(breakStart.getDate() + 1);
        }

        // Calcula quanto tempo falta até o próximo início de intervalo
        const timeUntilStart = Math.floor((breakStart - now) / 1000);
        setRemainingTime(formatTime(timeUntilStart));
      }
    }, 1000); // Atualiza a cada segundo

    // Limpa o intervalo ao desmontar o componente
    return () => clearInterval(interval);
  }, []);

  // Renderização da interface
  return (
    <View style={styles.container}>
      {/* Exibe se o intervalo está ativo ou inativo */}
      <Text style={styles.header}>
        {isBreakActive ? "Intervalo Ativo" : "Intervalo Inativo"}
      </Text>

      {/* Exibe contagem regressiva ou tempo até o início */}
      <Text style={styles.timerText}>
        {isBreakActive ? "Tempo Restante:" : "Tempo até o Início:"}{" "}
        {remainingTime}
      </Text>
    </View>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Centraliza verticalmente
    alignItems: "center", // Centraliza horizontalmente
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  timerText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
  },
});
