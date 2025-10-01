import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Theme from "./styles/ThemeStyles";

// Função para gerar código aleatório
const gerarCodigoAluno = () => {
  const numeros = Math.floor(Math.random() * 900 + 100); // 3 dígitos
  const letras = String.fromCharCode(Math.floor(Math.random() * 26) + 65); // letra maiúscula
  const simbolos = ["#", "@", "$", "&", "*"];
  const simbolo = simbolos[Math.floor(Math.random() * simbolos.length)];
  return `${numeros}${simbolo}${letras}`;
};

export default function ADMScreen() {
  const navigation = useNavigation();
  const [alunos, setAlunos] = useState([]);
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");

  // Cadastro de aluno
  const cadastrarAluno = async () => {
    if (!nome || !matricula)
      return Alert.alert("Erro", "Preencha todos os campos");

    if (alunos.some((a) => a.matricula === matricula))
      return Alert.alert("Erro", "Matrícula já cadastrada");

    const codigo = gerarCodigoAluno();
    const novoAluno = { id: Date.now().toString(), nome, matricula, codigo };
    const novosAlunos = [...alunos, novoAluno];

    setAlunos(novosAlunos);
    await AsyncStorage.setItem("alunos", JSON.stringify(novosAlunos));

    Alert.alert(
      "Sucesso",
      `Aluno(a) ${nome} cadastrado(a) com código: ${codigo}`
    );
    setNome("");
    setMatricula("");
  };

  // Limpar AsyncStorage
  const limparAsyncStorage = async () => {
    await AsyncStorage.clear();
    setAlunos([]);
    Alert.alert("Sucesso", "AsyncStorage limpo");
  };

  useEffect(() => {
    (async () => {
      const storedAlunos =
        JSON.parse(await AsyncStorage.getItem("alunos")) || [];
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

      <View style={{ marginVertical: 10 }}>
        <TouchableOpacity style={Theme.button} onPress={cadastrarAluno} activeOpacity={0.8}>
          <Text style={Theme.buttonText}>Cadastrar Aluno</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={alunos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={Theme.card}>
            <Text style={Theme.cardText}>
              {item.nome} - Matrícula: {item.matricula} - Código: {item.codigo}
            </Text>
          </View>
        )}
      />

      <View style={{ marginVertical: 10 }}>
        <TouchableOpacity style={[Theme.button, { backgroundColor: '#FF0000' }]} onPress={limparAsyncStorage} activeOpacity={0.8}>
          <Text style={[Theme.buttonText, { color: '#ffffffff' }]}>Limpar AsyncStorage</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        <TouchableOpacity style={Theme.button} onPress={() => navigation.replace("LoginChoice")} activeOpacity={0.8}>
          <Text style={Theme.buttonText}>Voltar para Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
