// 5. Tela de Intervalo
// Mostra se o intervalo está ativo.
// Mostra o tempo restante para o intervalo começar ou acabar.
// Usar Date para comparação com horário atual.

import React, { useState, useEffect } from "react";

const BreakScreen = () => {
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");

  const breakStartTime = new Date(); // Replace with actual break start time
  const breakEndTime = new Date(); // Replace with actual break end time

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now >= breakStartTime && now <= breakEndTime) {
        setIsBreakActive(true);
        const timeLeft = Math.floor((breakEndTime - now) / 1000); // Time in seconds
        setRemainingTime(`${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`);
      } else {
        setIsBreakActive(false);
        const timeUntilStart = Math.floor((breakStartTime - now) / 1000);
        setRemainingTime(
          `${Math.floor(timeUntilStart / 60)}m ${timeUntilStart % 60}s`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [breakStartTime, breakEndTime]);

  return (
    <div>
      <h1>{isBreakActive ? "Intervalo Ativo" : "Intervalo Inativo"}</h1>
      <p>
        {isBreakActive ? "Tempo restante:" : "Tempo até o início:"}{" "}
        {remainingTime}
      </p>
    </div>
  );
};

export default BreakScreen;