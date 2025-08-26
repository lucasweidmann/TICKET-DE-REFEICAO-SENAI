import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ADMScreen() {
  const [alunos, setAlunos] = useState([]);
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [ticketsHoje, setTicketsHoje] = useState([]);

  useEffect(() => {
    // Carrega alunos do AsyncStorage
    (async () => {
      const storedAlunos = JSON.parse(await AsyncStorage.getItem("alunos")) || [];
      setAlunos(storedAlunos);
    })();
  }, []);

  const cadastrarAluno = async () => {
    if (!nome || !matricula) return Alert.alert("Erro", "Preencha todos os campos");

    // Verifica se matrícula já existe
    if (alunos.some(a => a.matricula === matricula)) {
      return Alert.alert("Erro", "Matrícula já cadastrada");
    }

    const novoAluno = { nome, matricula };
    setAlunos([...alunos, novoAluno]);
    await AsyncStorage.setItem("alunos", JSON.stringify([...alunos, novoAluno]));
    setNome("");
    setMatricula("");
  };

  const resetarTickets = async () => {
    setTicketsHoje([]);
    Alert.alert("Sucesso", "Tickets resetados para o dia");
  };

  const limparAsyncStorage = async () => {
    await AsyncStorage.clear();
    setAlunos([]);
    setTicketsHoje([]);
    Alert.alert("Sucesso", "AsyncStorage limpo");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Alunos</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Matrícula"
        value={matricula}
        onChangeText={setMatricula}
      />
      <Button title="Cadastrar Aluno" onPress={cadastrarAluno} />
      <FlatList
        data={alunos}
        keyExtractor={(item) => item.matricula}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.nome} - {item.matricula}</Text>
          </View>
        )}
      />
      <Button title="Resetar Tickets do Dia" onPress={resetarTickets} />
      <Button title="Limpar Alunos Registrados ( AsyncStorage )" onPress={limparAsyncStorage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
