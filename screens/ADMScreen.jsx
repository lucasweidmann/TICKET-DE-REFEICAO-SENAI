// 4. Tela de ADM
// Permite cadastrar alunos (nome, matrícula, etc).
// Permite visualizar quais alunos já pegaram o ticket no dia.
// (Opcional) Histórico de uso dos tickets (por data).
// Botão para "resetar" os tickets no fim do dia.


//vou comecar a trabalhar de verdade agora, me deseje sorte
import React, { useState } from "react";

const ADMScreen = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [registration, setRegistration] = useState("");
  const [ticketHistory, setTicketHistory] = useState([]);
  const [ticketsToday, setTicketsToday] = useState([]);

  const handleRegisterStudent = () => {
    if (name && registration) {
      const newStudent = { name, registration };
      setStudents([...students, newStudent]);
      setName("");
      setRegistration("");
    }
  };

  const handleGiveTicket = (student) => {
    if (!ticketsToday.find((s) => s.registration === student.registration)) {
      setTicketsToday([...ticketsToday, student]);
    }
  };

  const handleResetTickets = () => {
    setTicketHistory([
      ...ticketHistory,
      { date: new Date().toLocaleDateString(), tickets: ticketsToday },
    ]);
    setTicketsToday([]);
  };

  return (
    <div>
      <h1>ADM Screen</h1>

      {/* Student Registration */}
      <div>
        <h2>Register Student</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Registration"
          value={registration}
          onChange={(e) => setRegistration(e.target.value)}
        />
        <button onClick={handleRegisterStudent}>Register</button>
      </div>

      {/* Students List */}
      <div>
        <h2>Students</h2>
        <ul>
          {students.map((student, index) => (
            <li key={index}>
              {student.name} ({student.registration})
              <button onClick={() => handleGiveTicket(student)}>
                Give Ticket
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tickets Today */}
      <div>
        <h2>Tickets Today</h2>
        <ul>
          {ticketsToday.map((student, index) => (
            <li key={index}>
              {student.name} ({student.registration})
            </li>
          ))}
        </ul>
      </div>

      {/* Ticket History */}
      <div>
        <h2>Ticket History</h2>
        <ul>
          {ticketHistory.map((entry, index) => (
            <li key={index}>
              {entry.date}: {entry.tickets.map((s) => s.name).join(", ")}
            </li>
          ))}
        </ul>
      </div>

      {/* Reset Tickets */}
      <div>
        <button onClick={handleResetTickets}>Reset Tickets</button>
      </div>
    </div>
  );
};

export default ADMScreen;