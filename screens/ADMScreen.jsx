import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ImageBackground,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import planoDataUri from "../assets/planodefundo";

// Tela administrativa — permite cadastrar alunos, visualizar lista e gerenciar dados locais
export default function ADMScreen() {
  // Estados principais
  const [alunos, setAlunos] = useState([]); // Lista de alunos cadastrados
  const [nome, setNome] = useState(""); // Nome do aluno
  const [matricula, setMatricula] = useState(""); // Matrícula do aluno
  const [mostrarAlunos, setMostrarAlunos] = useState(false); // Controle de exibição da lista

  // Gera um código de login único para o aluno (ex: "432@X")
  const gerarCodigoAluno = () => {
    const numeros = Math.floor(Math.random() * 900 + 100); // 3 dígitos aleatórios
    const letras = String.fromCharCode(Math.floor(Math.random() * 26) + 65); // Letra maiúscula
    const simbolos = ["#", "@", "$", "&", "*"];
    const simbolo = simbolos[Math.floor(Math.random() * simbolos.length)];
    return `${numeros}${simbolo}${letras}`;
  };

  // Cadastra aluno no AsyncStorage e exibe alerta de sucesso
  const cadastrarAluno = async () => {
    if (!nome || !matricula)
      return Alert.alert("Erro", "Preencha Todos os Campos");

    // Evita duplicidade de matrícula
    if (alunos.some((a) => a.matricula === matricula))
      return Alert.alert("Erro", "Matrícula já Cadastrada");

    // Cria objeto do novo aluno
    const codigo = gerarCodigoAluno();
    const novoAluno = { id: Date.now().toString(), nome, matricula, codigo };

    // Atualiza lista e persiste no armazenamento
    const novosAlunos = [...alunos, novoAluno];
    setAlunos(novosAlunos);
    await AsyncStorage.setItem("alunos", JSON.stringify(novosAlunos));

    Alert.alert(
      "Sucesso",
      `Aluno(a) ${nome} Cadastrado(a) com Código: ${codigo}`
    );

    // Limpa campos após cadastro
    setNome("");
    setMatricula("");
  };

  // Limpa completamente o AsyncStorage (usado apenas em testes)
  const limparAsyncStorage = async () => {
    await AsyncStorage.clear();
    setAlunos([]);
    Alert.alert("Sucesso", "AsyncStorage Limpo");
  };

  // Reseta os tickets do dia (para reiniciar validações diárias)
  const resetTickets = async () => {
    await AsyncStorage.setItem("ticketsHoje", JSON.stringify([]));
    Alert.alert("Sucesso", "Tickets Resetados.");
  };

  // Alterna entre mostrar/ocultar lista de alunos
  const toggleListaAlunos = () => setMostrarAlunos(!mostrarAlunos);

  // Carrega alunos armazenados ao abrir a tela
  useEffect(() => {
    (async () => {
      const stored = JSON.parse(await AsyncStorage.getItem("alunos")) || [];
      setAlunos(stored);
    })();
  }, []);

  // Tratamento de imagem de fundo (fallback para base64 se não houver arquivo físico)
  let bgSource;
  try {
    bgSource = require("../assets/planodefundo.jpeg");
  } catch (e) {
    bgSource = { uri: planoDataUri };
  }

  return (
    <ImageBackground source={bgSource} style={{ flex: 1 }} resizeMode="cover">
      <View style={[styles.container, { marginTop: 80 }]}>
        <Text style={styles.header}>Cadastro de Alunos</Text>

        {/* Campos de entrada de dados */}
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

        {/* Botão de cadastro */}
        <TouchableOpacity style={styles.button} onPress={cadastrarAluno}>
          <Text style={styles.buttonText}>Cadastrar Aluno</Text>
        </TouchableOpacity>

        {/* Botão para exibir ou ocultar lista */}
        <TouchableOpacity style={styles.button} onPress={toggleListaAlunos}>
          <Text style={styles.buttonText}>
            {mostrarAlunos ? "Ocultar Alunos" : "Listar Alunos"}
          </Text>
        </TouchableOpacity>

        {/* Lista de alunos cadastrados */}
        {mostrarAlunos && (
          <FlatList
            data={alunos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardText}>
                  {item.nome} - Matrícula: {item.matricula} - Código:{" "}
                  {item.codigo}
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.noText}>Nenhum Aluno Cadastrado.</Text>
            }
          />
        )}

        {/* Botões administrativos extras */}
        <TouchableOpacity style={styles.button} onPress={limparAsyncStorage}>
          <Text style={styles.buttonText}>Limpar AsyncStorage </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={resetTickets}>
          <Text style={styles.buttonText}>Resetar Tickets do Dia</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#000",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 6,
  },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  card: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardText: { color: "#000" },
  noText: { textAlign: "center", color: "#000", marginVertical: 10 },
});
