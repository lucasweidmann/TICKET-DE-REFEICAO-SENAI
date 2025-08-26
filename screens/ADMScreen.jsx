// 4. Tela de ADM
// Permite cadastrar alunos (nome, matrícula, etc).
// Permite visualizar quais alunos já pegaram o ticket no dia.
// (Opcional) Histórico de uso dos tickets (por data).
// Botão para "resetar" os tickets no fim do dia.

// bora trabalhar agora, me deseje sorte
import React, { useState } from "react";

const ADMScreen = () => {
  const [alunos, setAlunos] = useState([]);
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [historicoTickets, setHistoricoTickets] = useState([]);
  const [ticketsHoje, setTicketsHoje] = useState([]);

  const cadastrarAluno = () => {
    if (nome && matricula) {
      const novoAluno = { nome, matricula };
      setAlunos([...alunos, novoAluno]);
      setNome("");
      setMatricula("");
    }
  };

  const darTicket = (aluno) => {
    if (!ticketsHoje.find((a) => a.matricula === aluno.matricula)) {
      setTicketsHoje([...ticketsHoje, aluno]);
    }
  };

  const handleResetTickets = () => {
    setHistoricoTickets([
      ...historicoTickets,
      { date: new Date().toLocaleDateString(), tickets: ticketsHoje },
    ]);
    setTicketsHoje([]);
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
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="text"
          placeholder="Registration"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
        />
        <button onClick={cadastrarAluno}>Register</button>
      </div>

      {/* Students List */}
      <div>
        <h2>Students</h2>
        <ul>
          {alunos.map((aluno, index) => (
            <li key={index}>
              {aluno.nome} ({aluno.matricula})
              <button onClick={() => darTicket(aluno)}>
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
          {ticketsHoje.map((aluno, index) => (
            <li key={index}>
              {aluno.nome} ({aluno.matricula})
            </li>
          ))}
        </ul>
      </div>

      {/* Ticket History */}
      <div>
        <h2>Ticket History</h2>
        <ul>
          {historicoTickets.map((entry, index) => (
            <li key={index}>
              {entry.date}: {entry.tickets.map((a) => a.nome).join(", ")}
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