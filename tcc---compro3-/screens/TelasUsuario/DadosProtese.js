import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, ImageBackground,
} from "react-native";
import { getImagemPorId } from '../imagensProdutos'; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const DetalhesProtese = ({ route, navigation }) => {
  const { id, origem } = route.params; 
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await fetch(`https://minha-api-ochre.vercel.app/`);
        const data = await response.json();
        const produtoEncontrado = data.find((item) => item.id === id);
        setProduto(produtoEncontrado);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!produto) {
    return (
      <View style={styles.loader}>
        <Text>
          Produto não encontrado
        </Text>
      </View>
    );
  }

  const imagemLocal = getImagemPorId(produto.id);

  const handleAddToCart = async () => {
    try {
      const carrinhoAtual = await AsyncStorage.getItem('carrinho');
      const carrinho = carrinhoAtual ? JSON.parse(carrinhoAtual) : [];

      const jaExiste = carrinho.some((item) => {
        const idItem = typeof item === 'object' ? item.id : item;
        return idItem === produto.id;
      });

      if (!jaExiste) {
        carrinho.push({ id: produto.id, quantidade: 1 });
        await AsyncStorage.setItem('carrinho', JSON.stringify(carrinho));
        alert('Produto adicionado ao carrinho!');
      } else {
        alert('Este produto já está no carrinho.');
      }
      
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      alert('Ocorreu um erro ao adicionar o produto ao carrinho.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ImageBackground
          source={require('../../assets/Plano_Fundo/ApertoMao.jpg')}
          style={styles.header}
          resizeMode="cover" 
        >

          <View style={styles.overlay} />

          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => {
                if (origem === 'Carrinho') {
                  navigation.navigate('Carrinho'); 
                } else {
                  navigation.navigate('TelasUsuario'); 
                }
              }}
            >
              <Image
                source={require("../../assets/icones/SetaVoltarBranca.png")}
                style={styles.backImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.titulo}>
                Detalhes do Produto
              </Text>
            </View>
          </View>

          <View style={styles.imageCard}>
            <Image
              source={imagemLocal}
              style={styles.produtoImagem}
              resizeMode="contain"
            />
          </View>
        </ImageBackground>

        <View style={styles.infoRow}>
          <Text style={[styles.preco, styles.leftAlign]}>
            Preço:{"\n"}
            <Text style={styles.precoValor}>
              R$ {produto.informacoesCompraGarantia?.valor.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </Text>
          </Text>

          <Text style={[styles.tipo, styles.rightAlign]}>
            Prótese:{"\n"}
            <Text style={styles.tipoValor}>{produto.tipo}</Text>
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Descrição da Prótese</Text>
          <Text style={styles.cardTexto}>{produto.descricao}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Especificações Técnicas</Text>
          {(produto.especificacoesTecnicas ?? []).map((item, index) => (
            <Text key={index} style={styles.cardTexto}>
              • {item}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Indicações</Text>
          {(produto.indicacoes ?? []).map((item, index) => (
            <Text key={index} style={styles.cardTexto}>
              • {item}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Tecnologia</Text>
          {(produto.tecnologia ?? []).map((item, index) => (
            <Text key={index} style={styles.cardTexto}>
              • {item}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Diferenciais</Text>
          {(produto.diferenciais ?? []).map((item, index) => (
            <Text key={index} style={styles.cardTexto}>
              • {item}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>
            Informações de Compra e Garantia
          </Text>
          <Text style={styles.cardTexto}>
            Valor: R${" "}
            {produto.informacoesCompraGarantia?.valor?.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </Text>
          <Text style={styles.cardTexto}>
            Garantia: {produto.informacoesCompraGarantia?.garantia}
          </Text>
          <Text style={styles.cardTexto}>
            Entrega: {produto.informacoesCompraGarantia?.entrega}
          </Text>
          <Text style={styles.cardTexto}>Formas de pagamento:</Text>
          {(produto.informacoesCompraGarantia?.pagamento ?? []).map((item, index) => (
            <Text key={index} style={styles.cardTexto}>
              • {item}
            </Text>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.footerButton, styles.addButton]}
          onPress={handleAddToCart}
        >
          <Text style={styles.footerButtonText}>
            Adicionar ao carrinho
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.footerButton, styles.customizeButton]}>
          <Text style={styles.footerButtonText}>
            Personalizar
          </Text>
          <Image
            source={require("../../assets/icones/LapisPersonaizacaoIcon.png")}
            style={styles.pencilIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DetalhesProtese;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f0ec",
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 25,
    overflow: 'hidden'
  },
   overlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerTop: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    position: "relative",
    marginTop: 43,
  },
  backImage: {
    width: 30,
    height: 30,
  },
  headerTitleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  imageCard: {
    backgroundColor: "#fbfbfb",
    padding: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    marginTop: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  produtoImagem: {
    width: 150,
    height: 200,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    backgroundColor: "#fbfbfb",
    marginBottom: 8,
    paddingTop: 10,
  },
  leftAlign: {
    flex: 1,
    textAlign: "left",
    paddingRight: 10,
    marginLeft: 35,
  },
  rightAlign: {
    flex: 1,
    paddingRight: 20,
    textAlign: "right", 
    flexWrap: "wrap",  
    marginRight: 25,
  },
  tipo: {
    fontSize: 16,
    color: "#333",
  },
  tipoValor: {
    fontSize: 18,
    color: "#000",
  },
  preco: {
    fontSize: 16,
    color: "#333",
    marginBottom: 35,
  },
  precoValor: {
    fontSize: 18,
    color: "#000",
  },
  card: {
    backgroundColor: "#fbfbfb",
    borderRadius: 6,
    marginHorizontal: 6,
    marginBottom: 7,
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
    paddingLeft: 18,
    paddingRight: 18,
  },
  cardTexto: {
    fontSize: 16,
    color: "#444",
    marginBottom: 4,
    paddingLeft: 18,
    paddingRight: 18,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: "#fbfbfb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  scrollContent: {
    paddingBottom: 100, 
  },
  footerButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  addButton: {
    backgroundColor: "#000",
    marginRight: 10,
  },
  customizeButton: {
    backgroundColor: "#47667b",
    marginLeft: 10,
  },
  footerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  pencilIcon: {
    width: 20,
    height: 20,
    marginLeft: 2,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
