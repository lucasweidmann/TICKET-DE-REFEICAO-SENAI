import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function ADMScreen() {
  const navigation = useNavigation();
  const [alunos, setAlunos] = useState([]);
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [ticketsHoje, setTicketsHoje] = useState([]);

  useEffect(() => {
    (async () => {
      const storedAlunos =
        JSON.parse(await AsyncStorage.getItem("alunos")) || [];
      setAlunos(storedAlunos);
    })();
  }, []);

  const cadastrarAluno = async () => {
    if (!nome || !matricula)
      return Alert.alert("Erro", "Preencha todos os campos");
    if (alunos.some((a) => a.matricula === matricula))
      return Alert.alert("Erro", "Matrícula já cadastrada");

    const novoAluno = { nome, matricula };
    const novosAlunos = [...alunos, novoAluno];
    setAlunos(novosAlunos);
    await AsyncStorage.setItem("alunos", JSON.stringify(novosAlunos));
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
            <Text>
              {item.nome} - {item.matricula}
            </Text>
          </View>
        )}
      />

      <Button title="Resetar Tickets do Dia" onPress={resetarTickets} />
      <Button
        title="Limpar Alunos Registrados (AsyncStorage)"
        onPress={limparAsyncStorage}
      />

      {/* Botão voltar para Login */}
      <View style={{ marginTop: 20 }}>
        <Button
          title="Voltar para Login"
          onPress={() => navigation.replace("Login")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5", // Cor de fundo clara
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Cor do texto
    marginBottom: 20,
    textAlign: "center", // Centraliza o título
  },
});
