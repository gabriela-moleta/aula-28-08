import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [tarefa, setTarefa] = useState("");
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    try {
      const lista = await AsyncStorage.getItem("tarefas");
      if (lista !== null) {
        setTarefas(JSON.parse(lista));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const salvarTarefas = async (lista) => {
    try {
      await AsyncStorage.setItem("tarefas", JSON.stringify(lista));
    } catch (error) {
      console.log(error);
    }
  };

  const adicionarTarefa = () => {
    if (tarefa.trim() === "") {
      Alert.alert("Atenção", "Digite uma tarefa antes de adicionar!");
      return;
    }
    const novaLista = [...tarefas, { id: Date.now().toString(), texto: tarefa }];
    setTarefas(novaLista);
    salvarTarefas(novaLista);
    setTarefa("");
  };

  const excluirTarefa = (id) => {
    const novaLista = tarefas.filter((item) => item.id !== id);
    setTarefas(novaLista);
    salvarTarefas(novaLista);
  };

  const limparTudo = async () => {
    await AsyncStorage.removeItem("tarefas");
    setTarefas([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>✨ Minha Lista de Tarefas</Text>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma tarefa..."
          value={tarefa}
          onChangeText={setTarefa}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.botao} onPress={adicionarTarefa}>
          <Text style={styles.botaoTexto}>+</Text>
        </TouchableOpacity>
      </View>

      {tarefas.length === 0 ? (
        <Text style={styles.mensagem}>Nenhuma tarefa por aqui 😉</Text>
      ) : (
        <FlatList
          data={tarefas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.texto}>{item.texto}</Text>
              <TouchableOpacity
                style={styles.excluir}
                onPress={() => excluirTarefa(item.id)}
              >
                <Text style={styles.excluirTexto}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {tarefas.length > 0 && (
        <TouchableOpacity style={styles.limpar} onPress={limparTudo}>
          <Text style={styles.limparTexto}>Limpar Tudo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#EAF6F6",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2C6975",
  },
  inputArea: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    elevation: 2,
  },
  botao: {
    marginLeft: 10,
    backgroundColor: "#68B0AB",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  texto: {
    fontSize: 16,
    color: "#333",
  },
  excluir: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#FF6B6B",
  },
  excluirTexto: {
    fontSize: 16,
    color: "#fff",
  },
  limpar: {
    marginTop: 15,
    backgroundColor: "#FF6B6B",
    padding: 14,
    borderRadius: 12,
    elevation: 2,
  },
  limparTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  mensagem: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 50,
    color: "#666",
  },
});
