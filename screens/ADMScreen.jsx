// 4. Tela de ADM
// Permite cadastrar alunos (nome, matrícula, etc).
// Permite visualizar quais alunos já pegaram o ticket no dia.
// (Opcional) Histórico de uso dos tickets (por data).
// Botão para "resetar" os tickets no fim do dia.

// bora trabalhar agora, me deseje sorte
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ADMScreen() {
  const [alunos, setAlunos] = useState([]);
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [ticketsHoje, setTicketsHoje] = useState([]);
  const [historicoTickets, setHistoricoTickets] = useState([]);

  useEffect(() => {
    // Carrega alunos e histórico do AsyncStorage
    (async () => {
      const storedAlunos = JSON.parse(await AsyncStorage.getItem("alunos")) || [];
      setAlunos(storedAlunos);

      const storedHistorico = JSON.parse(await AsyncStorage.getItem("historicoTickets")) || [];
      setHistoricoTickets(storedHistorico);
    })();
  }, []);

  const cadastrarAluno = async () => {
    if (!nome || !matricula) return Alert.alert("Erro", "Preencha todos os campos");

    // Verifica se matrícula já existe
    if (alunos.some(a => a.matricula === matricula)) {
      return Alert.alert("Erro", "Matrícula já cadastrada");
    }

    const novoAluno = { nome, matricula };
    const novosAlunos = [...alunos, novoAluno];
    setAlunos(novosAlunos);
    await AsyncStorage.setItem("alunos", JSON.stringify(novosAlunos));

    setNome("");
    setMatricula("");
  };

  const darTicket = aluno => {
    if (!ticketsHoje.find(a => a.matricula === aluno.matricula)) {
      const novosTickets = [...ticketsHoje, aluno];
      setTicketsHoje(novosTickets);
    }
  };

  const handleResetTickets = async () => {
    const novoHistorico = [
      ...historicoTickets,
      { date: new Date().toLocaleDateString(), tickets: ticketsHoje }
    ];
    setHistoricoTickets(novoHistorico);
    await AsyncStorage.setItem("historicoTickets", JSON.stringify(novoHistorico));
    setTicketsHoje([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ADM Screen</Text>

      {/* Cadastro de Aluno */}
      <Text style={styles.subtitle}>Cadastrar Aluno</Text>
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Matrícula"
        value={matricula}
        onChangeText={setMatricula}
        style={styles.input}
      />
      <Button title="Cadastrar" onPress={cadastrarAluno} />

      {/* Lista de Alunos */}
      <Text style={styles.subtitle}>Alunos</Text>
      <FlatList
        data={alunos}
        keyExtractor={item => item.matricula}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.nome} ({item.matricula})</Text>
            <Button title="Dar Ticket" onPress={() => darTicket(item)} />
          </View>
        )}
      />

      {/* Tickets Hoje */}
      <Text style={styles.subtitle}>Tickets Hoje</Text>
      <FlatList
        data={ticketsHoje}
        keyExtractor={item => item.matricula}
        renderItem={({ item }) => (
          <Text>{item.nome} ({item.matricula})</Text>
        )}
      />

      {/* Histórico */}
      <Text style={styles.subtitle}>Histórico de Tickets</Text>
      <FlatList
        data={historicoTickets}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>{item.date}: {item.tickets.map(a => a.nome).join(", ")}</Text>
        )}
      />

      <Button title="Resetar Tickets" onPress={handleResetTickets} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  subtitle: { fontSize: 18, marginTop: 15, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 8, borderRadius: 5 },
  item: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }
});

// caralho, que preguica