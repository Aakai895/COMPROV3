import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity,
  SafeAreaView, ScrollView, Dimensions, ActivityIndicator, Alert,
} from "react-native";
import { useFonts } from "expo-font";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { getImagemPorId } from "../imagensProdutos";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const screenWidth = Dimensions.get("window").width;

export default function CarrinhoScreen({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [carrinhoIds, setCarrinhoIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    Alice: require("../../fonts/Alice-Regular.ttf"),
    Findel: require("../../fonts/Findel-Display-Regular.otf"),
  });

  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch("https://minha-api-ochre.vercel.app/");
        const data = await response.json();
        setProdutos(data);

        const carrinhoSalvo = await AsyncStorage.getItem("carrinho");
        const carrinho = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];

        const ids = carrinho.map((c) =>
          typeof c === "object" ? c.id : c
        );
        const qtds = {};
        carrinho.forEach((c) => {
          if (typeof c === "object" && c.quantidade) {
            qtds[c.id] = c.quantidade;
          } else if (typeof c === "number") {
            qtds[c] = 1;
          }
        });

        setCarrinhoIds(ids);
        setQuantidades(qtds);
        setSelecionados([]); 
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isFocused]);

  const saveCartToStorage = async (ids, quantObj) => {
    try {
      const toSave = ids.map((id) => ({
        id,
        quantidade: quantObj[id] ?? 1,
      }));
      await AsyncStorage.setItem("carrinho", JSON.stringify(toSave));
    } catch (e) {
      console.error("Erro salvando carrinho", e);
    }
  };

  const toggleSelecionar = (id) => {
    const novo =
      selecionados.includes(id)
        ? selecionados.filter((item) => item !== id)
        : [...selecionados, id];
    setSelecionados(novo);
  };

  const alterarQuantidade = (id, tipo) => {
    setQuantidades((prev) => {
      const atual = prev[id] || 1;
      const novoValor = tipo === "mais" ? atual + 1 : Math.max(1, atual - 1);
      const novo = { ...prev, [id]: novoValor };
      saveCartToStorage(carrinhoIds, novo);
      return novo;
    });
  };

  const calcularTotal = () => {
    return selecionados
      .reduce((acc, id) => {
        const produto = produtos.find((p) => p.id === id);
        const valor = produto?.informacoesCompraGarantia?.valor ?? 0;
        return acc + valor * (quantidades[id] || 1);
      }, 0)
      .toFixed(2);
  };

  const toggleSelecionarTodos = () => {
    if (selecionados.length === carrinhoIds.length) {
      setSelecionados([]);
    } else {
      setSelecionados(carrinhoIds);
    }
  };

  const removerProduto = async (id) => {
    console.log("Função removerProduto chamada para o ID:", id);

    try {
      const novoCarrinho = carrinhoIds.filter((pid) => Number(pid) !== Number(id));

      const novoQuant = { ...quantidades };
      delete novoQuant[id];

      setCarrinhoIds(novoCarrinho);
      setQuantidades(novoQuant);
      setSelecionados((prev) => prev.filter((pid) => Number(pid) !== Number(id)));

      await saveCartToStorage(novoCarrinho, novoQuant);
    } catch (error) {
      console.error("Erro ao remover produto:", error);
    }
  };

  const produtosCarrinho = produtos.filter((p) =>
    carrinhoIds.includes(p.id)
  );

  const produtosFiltrados = produtos.filter((item) => item.id >= 1);
  const fila1 = produtosFiltrados.slice(
    0,
    Math.ceil(produtosFiltrados.length / 3)
  );
  const fila2 = produtosFiltrados.slice(
    Math.ceil(produtosFiltrados.length / 3),
    Math.ceil((produtosFiltrados.length * 2) / 3)
  );
  const fila3 = produtosFiltrados.slice(
    Math.ceil((produtosFiltrados.length * 2) / 3)
  );

  if (!fontsLoaded || loading) {
    return (
      <SafeAreaView
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color="#3b5b82" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnVoltar}
          onPress={() => navigation.navigate("TelasUsuario")}
        >
          <Image source={require("../../assets/icones/SetaVoltar.png")}
            style={styles.imgVoltar}
          />
        </TouchableOpacity>

        <Text style={styles.tituloHeader}>
          Carrinho ({carrinhoIds.length})
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {carrinhoIds.length === 0 ? (
          <View style={styles.vazioInfo}>
            <Image source={require("../../assets/icones/iconProtese.png")}
              style={styles.vazioImagem}
              resizeMode="contain"
            />
            <Text style={styles.vazioTextoInfo}>
              Não há produtos no carrinho.
            </Text>
          </View>
        ) : (
          <View style={styles.selecionadosContainer}>
            {produtosCarrinho.map((item) => {
              const valor = item.informacoesCompraGarantia?.valor ?? 0;
              const valorFormatado = valor.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              const imagemUri =
                item.imagem?.startsWith("http")
                  ? item.imagem
                  : "https://picsum.photos/200/300";

              return (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Checkbox
                      style={styles.checkbox}
                      value={selecionados.includes(item.id)}
                      onValueChange={() => toggleSelecionar(item.id)}
                      color={selecionados.includes(item.id) ? "#3b5b82" : undefined}
                    />
                    <Text style={styles.cardTitle}>{item.tipo}</Text>

                    <TouchableOpacity 
                      onPress={() => {
                        console.log("Clique detectado no botão de remover");
                        removerProduto(item.id);
                      }}
                      style={styles.trashButton}
                    >
                    <FontAwesome5 name="trash" size={16} color="#ff788a" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.cardContent}>
                    <Image source={getImagemPorId(item.id)
                        ? getImagemPorId(item.id)
                        : require("../../assets/icones/ZapIcon.png")
                      }
                      style={styles.imagemSelecionado}
                    />

                    <View style={styles.infoContainer}>
                      <Text style={styles.fabricante}>
                        Fabricante: {item.fabricante?.nome || "Não informado"}
                      </Text>

                      <Text style={styles.entrega}>
                        Entrega:{" "}
                        {item.informacoesCompraGarantia?.entrega || "Não informado"}
                      </Text>

                      <Text style={styles.cardPrice}>
                        R$ {valorFormatado}
                      </Text>

                      <TouchableOpacity
                        style={styles.personalizacaoBtn}
                        onPress={() => {
                          Alert.alert("Personalização", `Visualizando personalização do produto: ${item.tipo}`);
                        }}
                      >
                        <Text style={styles.personalizacaoBtnText}>Visualizar Personalização</Text>
                      </TouchableOpacity>

                    </View>

                    <View style={styles.quantidade}>
                      <TouchableOpacity
                        style={styles.qtdBtn}
                        onPress={() => alterarQuantidade(item.id, "menos")}
                      >
                        <Text style={styles.qtdTexto}>-</Text>
                      </TouchableOpacity>

                      <Text style={styles.qtdValor}>{quantidades[item.id]}</Text>
                      <TouchableOpacity
                        style={styles.qtdBtn}
                        onPress={() => alterarQuantidade(item.id, "mais")}
                      >
                        <Text style={styles.qtdTexto}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.produtosContainerP}>
            {[fila1, fila2, fila3].map((fila, index) => (
              <ScrollView
                key={`fila-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScrollP}
              >
                {fila.map((item) => {
                  const imagemLocal = getImagemPorId(item.id);
                  const valor = item.informacoesCompraGarantia?.valor ?? 0;
                  const valorFormatado = valor.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });
                  const vendidos = item.quantidadeVendida ?? 0;

                  return (
                    <View key={`item-${item.id}`} style={styles.produtoCardWrapperP}>
                      <Image source={require('../../assets/icones/BordaCardCima.png')} 
                        style={styles.outsideTopIconP} 
                      />
                      
                      <TouchableOpacity
                        style={styles.produtoCardP}
                        onPress={() => {
                          navigation.navigate('DadosProtese', { id: item.id, origem: 'Carrinho' });
                        }}
                        activeOpacity={0.85}
                      >
                        <Image source={imagemLocal} 
                          style={styles.featuredImageP} 
                        />
                        <View style={styles.produtoCardContentP}>
                          <Text style={styles.produtoTituloP}>{item.tipo}</Text>
                          <View style={styles.priceSoldContainerP}>
                            <Text style={styles.produtoPrecoP}>R${valorFormatado}</Text>
                            <Text style={styles.produtoVendidosP}>{vendidos} vendidos</Text>
                          </View>
                        </View>
                      </TouchableOpacity>

                      <Image source={require('../../assets/icones/BordaCardBaixo.png')} 
                        style={styles.outsideBottomIconP} 
                      />
                    </View>
                  );
                })}
              </ScrollView>
            ))}
          </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.leftSection}>
          <Checkbox
            style={styles.checkbox}
            value={selecionados.length === carrinhoIds.length && carrinhoIds.length > 0}
            onValueChange={toggleSelecionarTodos}
            color="#000"
          />
          <Text style={styles.checkboxLabel}>
            Tudo
          </Text>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.total}>
            R$ {calcularTotal().toString().replace(".", ",")}
          </Text>

          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("FormasCompra")}
          >
            <Text style={styles.btnText}>
              Continuar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5" 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  btnVoltar: { 
    marginRight: 10, 
    marginTop: 33 
  },
  imgVoltar: { 
    width: 30, 
    height: 30, 
    resizeMode: "contain" 
  },
  tituloHeader: {
    fontSize: 20,
    fontFamily: "Findel",
    marginTop: 33,
    color: "#545454",
  },
  vazioInfo: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    paddingTop: 10,
  },
  vazioImagem: { 
    width: 80, 
    height: 80, 
    tintColor: "#bfbaba" 
    },
  vazioTextoInfo: {
    marginTop: 8,
    fontSize: 14,
    fontStyle: "italic",
    color: "#bfbaba",
  },
  selecionadosContainer: {
    marginBottom: 10,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  trashButton: {
    marginLeft: 'auto',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    height: 26, 
    width: 32, 
  },
  cardTitle: { 
    fontWeight: "bold", 
    fontSize: 16, color: "#333", 
    flex: 1 
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  imagemSelecionado: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: "cover",
  },
  infoContainer: { 
    flex: 1 
  },
  fabricante: { 
    fontSize: 12, 
    fontStyle: "italic",
    color: "#888" 
  },
  entrega: { 
    fontSize: 12, 
    fontStyle: "italic",
     color: "#888" 
    },
  cardPrice: { 
    fontWeight: "bold", 
    fontSize: 16, 
    color: "#ff788a",
    marginTop: 4 
    },
  quantidade: { 
    flexDirection: "row",
    alignItems: "center" 
  },
  qtdBtn: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    width: 22,
    height: 22,
  },
  qtdValor: { 
    marginHorizontal: 10, 
    fontWeight: "bold" 
  },
  qtdTexto: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#000" 
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  leftSection: { 
    flexDirection: "row", 
    alignItems: "center" 
    },
  checkbox: { 
    marginRight: 10 
  },
  checkboxLabel: { 
    fontSize: 16
  },
  rightSection: { 
    flexDirection: "row",
    alignItems: "center"
    },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff788a",
    marginRight: 16,
  },
  btn: {
    backgroundColor: "#47667b",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  btnText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  produtosContainerP: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 34,
  },
  horizontalScrollP: {
    paddingLeft: 10,
    marginBottom: 20,
  },
  produtoCardP: {
    width: screenWidth * 0.4,
    aspectRatio: 3 / 4,
    borderRadius: 12,
    marginRight: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  produtoCardContentP: {
    padding: 8,
    justifyContent: "space-between",
    flex: 1,
  },
  produtoTituloP: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  produtoPrecoP: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ff788a",
  },
  produtoVendidosP: {
    fontSize: 12,
    color: "#999",
    marginLeft: 4,
  },
  featuredImageP: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: "cover",
  },
  priceSoldContainerP: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  outsideTopIconP: {
    position: 'absolute',
    top: 10,
    left: -10,
    width: 100,
    height: 100,
    zIndex: 10,
    resizeMode: 'contain',
  },
  outsideBottomIconP: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 100,
    height: 100,
    zIndex: 10,
    resizeMode: 'contain',
  },
  produtoCardWrapperP: {
    position: 'relative',
    marginRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  personalizacaoBtn: {
    marginTop: 8,
    backgroundColor: "#e7e7e7",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  personalizacaoBtnText: {
    color: "#000",
    fontSize: 14,
  },
});