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
import Theme from "./styles/ThemeStyles";

export default function ADMScreen() {
  const navigation = useNavigation();
  const [alunos, setAlunos] = useState([]);
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");

  // Funções de cadastro, reset e limpeza (adicione aqui as funções que estavam no componente original)
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
    await AsyncStorage.setItem("ticketsHoje", JSON.stringify([]));
    Alert.alert("Sucesso", "Tickets resetados para o dia");
  };

  const limparAsyncStorage = async () => {
    await AsyncStorage.clear();
    setAlunos([]);
    Alert.alert("Sucesso", "AsyncStorage limpo");
  };

  useEffect(() => {
    (async () => {
      const storedAlunos = JSON.parse(await AsyncStorage.getItem("alunos")) || [];
      setAlunos(storedAlunos);
    })();
  }, []);

  return (
    <View style={Theme.container}>
      <Text style={Theme.header}>Cadastro de Alunos</Text>
      <TextInput
        style={Theme.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={Theme.input}
        placeholder="Matrícula"
        value={matricula}
        onChangeText={setMatricula}
      />
      <View style={{ marginBottom: 10 }}>
        <Button title="Cadastrar Aluno" onPress={cadastrarAluno} color="#000000ff" />
      </View>

      <FlatList
        data={alunos}
        keyExtractor={(item) => item.matricula}
        renderItem={({ item }) => (
          <View style={Theme.card}>
            <Text style={Theme.cardText}>
              {item.nome} - {item.matricula}
            </Text>
          </View>
        )}
      />

      <View style={{ marginBottom: 10 }}>
        <Button title="Resetar Tickets do Dia" onPress={resetarTickets} color="#000000ff" />
      </View>
      <View style={{ marginBottom: 10 }}>
        <Button
          title="Limpar Alunos Registrados (AsyncStorage)"
          onPress={limparAsyncStorage}
          color="#000000ff"
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <Button
          title="Voltar para Login"
          onPress={() => navigation.replace("Login")}
          color="#000000ff"
        />
      </View>
    </View>
  );
}
// ...
