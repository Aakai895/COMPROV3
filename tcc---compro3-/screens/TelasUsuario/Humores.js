import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image,
  TouchableOpacity, TextInput, Keyboard, Dimensions, FlatList
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FundoEmocoes from '../../Style/Backgrounds/Emocoes_Fundo';
import PencilIcon from '../../assets/icones/lapisIcon.png';

export default function HomeHumor({ navigation }) {
  const route = useRoute();
  const emocaoSelecionada = route.params?.emocao || 'feliz';
  const { height: screenHeight } = Dimensions.get("window");

  const [textoMotivo, setTextoMotivo] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [ultimoRegistro, setUltimoRegistro] = useState(null);
  const [registroSelecionado, setRegistroSelecionado] = useState(null);
  const [registroEmEdicao, setRegistroEmEdicao] = useState(null); 

  const emocoesConfig = {
    feliz: {
      fundo: '#f8f4c4',
      borda: '#f2c879',
      texto: '#000',
      titulo: 'Feliz',
      imagem: require('../../assets/Elementos_Complementares/Feliz.png'),
    },
    triste: {
      fundo: '#a1b1bc',
      borda: '#47667b',
      texto: '#fff',
      titulo: 'Triste',
      imagem: require('../../assets/Elementos_Complementares/Triste.png'),
    },
    neutro: {
      fundo: '#d9d9d9',
      borda: '#000',
      texto: '#000',
      titulo: 'Neutro',
      imagem: require('../../assets/Elementos_Complementares/Neutro.png'),
    },
    malestar: {
      fundo: '#b46974',
      borda: '#790918',
      texto: '#fff',
      titulo: 'Mal-Estar',
      imagem: require('../../assets/Elementos_Complementares/MalEstar.png'),
    },
  };

  const config = emocoesConfig[emocaoSelecionada] || emocoesConfig['feliz'];
  const isInstrucaoBranco = emocaoSelecionada === 'triste' || emocaoSelecionada === 'malestar';
  const isCancelarTextoBranco = emocaoSelecionada !== 'feliz';

  const formatarData = () => {
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const hoje = new Date();
    const dia = hoje.getDate();
    const mes = meses[hoje.getMonth()];
    return `${dia} de ${mes}`;
  };

  const adicionarTag = () => {
    if (tagInput.trim() !== '') {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removerTag = (indexParaRemover) => {
    setTags(tags.filter((_, index) => index !== indexParaRemover));
  };

  const alternarModoEdicao = () => {
    setModoEdicao(!modoEdicao);
  };

  const salvarDados = async () => {
    if (!emocaoSelecionada || (tags.length === 0 && textoMotivo.trim() === '')) {
      alert('Adicione pelo menos uma tag ou escreva um motivo.');
      return;
    }

    try {
      const registrosSalvos = await AsyncStorage.getItem('registrosHumor');
      let registros = registrosSalvos ? JSON.parse(registrosSalvos) : [];

      if (registroEmEdicao) {
        registros = registros.map(r =>
          r.data === registroEmEdicao.data
            ? { ...r, emocao: emocaoSelecionada, tags, motivo: textoMotivo.trim() }
            : r
        );
      } else {
        const hoje = new Date().toISOString().split("T")[0];
        const existeRegistroHoje = registros.some(r => r.data.startsWith(hoje));

        if (existeRegistroHoje) {
          registros = registros.filter(r => !r.data.startsWith(hoje));
        }

        const novoRegistro = {
          data: new Date().toISOString(),
          emocao: emocaoSelecionada,
          tags,
          motivo: textoMotivo.trim(),
        };

        registros.push(novoRegistro);
        setUltimoRegistro(novoRegistro);
      }
      await AsyncStorage.setItem('registrosHumor', JSON.stringify(registros));

      setHistorico([...registros].reverse());
      setTags([]);
      setTextoMotivo('');
      setModoEdicao(false);
      setRegistroSelecionado(null);
      setRegistroEmEdicao(null);
      Keyboard.dismiss();

    } catch (error) {
      console.error('Erro ao salvar dados', error);
      alert('Erro ao salvar dados.');
    }
  };

  const carregarHistorico = async () => {
    try {
      const registrosSalvos = await AsyncStorage.getItem('registrosHumor');
      const registros = registrosSalvos ? JSON.parse(registrosSalvos) : [];
      setHistorico(registros.reverse());
    } catch (error) {
      console.error('Erro ao carregar histórico', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarHistorico();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => {
    const data = new Date(item.data);
    const hoje = new Date();
    const isHoje =
      data.getFullYear() === hoje.getFullYear() &&
      data.getMonth() === hoje.getMonth() &&
      data.getDate() === hoje.getDate();

    const isSelecionado = registroSelecionado?.data === item.data;

    const textoDiaCor =
      emocaoSelecionada === 'triste' || emocaoSelecionada === 'malestar'
        ? '#fff'
        : '#000';

    return (
      <TouchableOpacity style={styles.weekItem}
        onPress={() => {
          setRegistroSelecionado(item);
          navigation.setParams({ emocao: item.emocao });
        }}
      >
        <Image source={emocoesConfig[item.emocao]?.imagem}
          style={[ styles.weekAvatar, { 
            borderColor: emocoesConfig[item.emocao]?.borda },
          ]}
        />
        <View style={[ styles.dayTextWrapper, isSelecionado && {
          backgroundColor: 'black',
          borderRadius: 10,
          paddingHorizontal: 6,
          },]}
        >
          <Text style={[ styles.dayText, { color: isSelecionado ? '#fff' : textoDiaCor, },]}>
            {isHoje ? 'Hoje' : data 
              .toLocaleDateString('pt-BR', {weekday: 'short', })
              .replace('-feira', ''
            )}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FundoEmocoes />
      <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          extraScrollHeight={screenHeight * 0.2}
        >
          <Image source={require('../../assets/Elementos_Complementares/EmocoesRostos.png')}
            style={styles.rostos}
          />

          <View style={styles.conteudoInferior}>
            <Text style={styles.titulo}>
              Meu Humor
            </Text>
        <Text style={styles.data}>
          {registroSelecionado 
            ? new Date(registroSelecionado.data).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
            : formatarData()}
        </Text>


            <View style={[styles.happyview, { backgroundColor: config.fundo, borderColor: config.borda }]}>
              <Image source={config.imagem} style={styles.felizimagem} />

              <View style={{ marginTop: 10, marginBottom: 10, position: 'relative', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => {
                    setRegistroSelecionado(null);
                    setUltimoRegistro(null);
                    navigation.navigate('TelasUsuario', { screen: 'Emocoes' });
                  }}
                  style={{ position: 'absolute', left: 40 }}
                  hitSlop={{ top: 10, bottom: 0, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons
                    name="arrow-left"
                    size={28}
                    color={config.texto}
                  />
                </TouchableOpacity>

                <Text style={[styles.textoFeliz, { color: config.texto }]}>
                  {config.titulo}
                </Text>

                {registroSelecionado && (
                  <TouchableOpacity
                    onPress={() => {
                      setTags(registroSelecionado.tags);
                      setTextoMotivo(registroSelecionado.motivo);
                      setRegistroEmEdicao(registroSelecionado); 
                      setRegistroSelecionado(null); 
                      setUltimoRegistro(null);
                    }}
                    style={{ position: 'absolute', right: 40 }}
                    hitSlop={{ top: 10, bottom: 0, left: 10, right: 10 }}
                  >
                    <Image source={PencilIcon} 
                      style={{ width: 20, height: 20, tintColor: config.borda }}
                    />
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.margem}>
                <View style={[styles.linhaSeparadora, { borderColor: config.borda }]} />

                {!registroSelecionado && !ultimoRegistro && (
                  <>
                    <Text style={[styles.instrucao, isInstrucaoBranco && { color: '#fff' }]}>
                      Adicione tag(s) sobre o que você está sentindo. Ex: Alegre.
                    </Text>

                    <View style={styles.tagInputContainer}>
                      <TextInput
                        style={styles.tagInput}
                        placeholder="Digite uma tag..."
                        value={tagInput}
                        onChangeText={setTagInput}
                      />
                      <TouchableOpacity style={styles.adicionar} onPress={adicionarTag}>
                        <Text style={styles.adicionarTexto}>
                          Adicionar
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.tagsContainer}>
                      {tags.map((tag, index) => (
                        <View key={index} style={styles.tagWrapper}>
                          <View style={styles.tag}>
                            <Text style={styles.tagText}>#{tag}</Text>
                            {modoEdicao && (
                              <TouchableOpacity
                                style={styles.fecharTag}
                                onPress={() => removerTag(index)}
                              >
                                <Text style={styles.fecharTexto}>×</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      ))}
                    </View>

                    {tags.length > 0 && (
                      <View style={styles.editarContainer}>
                        <TouchableOpacity style={[styles.botaoEditar, { backgroundColor: config.borda }]}
                          onPress={alternarModoEdicao}
                        >
                          {modoEdicao ? (
                            <Text style={[styles.editarTexto, { color: '#fff' }]}>
                              Concluído
                            </Text>
                          ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <MaterialCommunityIcons
                                name="trash-can-outline"
                                size={20}
                                color="#fff"
                              />
                              <Text style={[styles.editarTexto, { color: '#fff', marginLeft: 6 }]}>
                                Editar Tags
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </View>
                    )}

                    <View style={[styles.linhaSeparadoraLonga, { backgroundColor: config.borda }]} />

                    <Text style={[styles.instrucao, isInstrucaoBranco && { color: '#fff' }]}>
                      Escreva aqui...
                    </Text>

                    <TextInput
                      style={styles.formtext}
                      placeholder="Escreva seu motivo aqui..."
                      placeholderTextColor="#000000"
                      multiline
                      scrollEnabled
                      textAlignVertical="top"
                      value={textoMotivo}
                      onChangeText={setTextoMotivo}
                    />

                    <View style={styles.botoesContainer}>
                      <TouchableOpacity style={styles.save} onPress={salvarDados}>
                        <Text style={styles.botaoSalvarTexto}>
                          Salvar
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={[styles.cancel, { backgroundColor: config.borda, borderColor: config.borda }]}
                        onPress={() => navigation.navigate('TelasUsuario', { screen: 'Emocoes' })}
                      >
                        <Text style={[styles.botaoCancelarTexto, isCancelarTextoBranco && { color: '#fff' }]}>
                          Cancelar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {!registroSelecionado && ultimoRegistro && (
                  <View style={{ marginTop: 10 }}>
                    {ultimoRegistro.tags.length > 0 && (
                      <View style={{ flexDirection: "row", flexWrap: "wrap"}}>
                        {ultimoRegistro.tags.map((tag, i) => (
                          <View
                            key={i}
                            style={{
                              backgroundColor: "#fff",
                              borderRadius: 20,
                              paddingVertical: 6,
                              paddingHorizontal: 14,
                              margin: 5,
                              borderWidth: 1.5,
                              borderColor: config.borda,
                              color: '#000',
                            }}
                          >
                            <Text style={{ fontSize: 16, color: config.texto }}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    <View style={[styles.linhaSeparadoraLonga, { backgroundColor: config.borda }]} />

                    {ultimoRegistro.motivo !== "" && (
                      <Text style={{ marginTop: 15, fontSize: 16, lineHeight: 22, textAlign: "center", color: config.texto }}>
                        {ultimoRegistro.motivo}
                      </Text>
                    )}
                  </View>
                )}

                {registroSelecionado && (
                  <View style={{ marginTop: 10 }}>
                    {registroSelecionado.tags.length > 0 && (
                      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                        {registroSelecionado.tags.map((tag, i) => (
                          <View
                            key={i}
                            style={{
                              backgroundColor: "#fff",
                              borderRadius: 20,
                              paddingVertical: 6,
                              paddingHorizontal: 14,
                              margin: 5,
                              borderWidth: 1.5,
                              borderColor: config.borda,
                              color: '#000',
                            }}
                          >
                            <Text style={{ fontSize: 16, color: (emocaoSelecionada === 'triste' || 
                              emocaoSelecionada === 'malestar') ? '#000' : config.texto }}
                            >
                              {tag}
                            </Text>

                          </View>
                        ))}
                      </View>
                    )}

                    <View style={[styles.linhaSeparadoraLonga, { backgroundColor: config.borda }]} />

                    {registroSelecionado.motivo !== "" && (
                      <Text style={{ marginTop: 15, fontSize: 16, lineHeight: 22, textAlign: "center", color: config.texto }}>
                        {registroSelecionado.motivo}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={{ backgroundColor: '#fff', color: config.texto  }}>
            <View style={[styles.weekContainer, { backgroundColor: config.fundo }]}>
              <FlatList
                horizontal
                data={historico.slice(0, 7)} 
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>
          
        </KeyboardAwareScrollView>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0f0f0' 
  },
  rostos: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 15,
    height: 180,
    width: 330,
  },
  titulo: {
    fontSize: 25,
    width: '70%',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  happyview: {
    borderTopWidth: 4,
    marginTop: 80,
    paddingBottom: 20,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  felizimagem: {
    height: 120,
    width: 100,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: -80,
  },
  textoFeliz: {
    fontSize: 25,
    width: '70%',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 2,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  margem: {
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  linhaSeparadora: {
    borderBottomWidth: 2.5,
    borderStyle: 'dashed',
    marginTop: 4,
    marginBottom: 7,
    height: 0,
  },
  linhaSeparadoraLonga: {
    height: 2,
    marginTop: 10,
    marginBottom: 10,
  },
  adicionar: {
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adicionarTexto: {
    color: '#000',
    fontSize: 18,
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
  },
  cancel: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 25,
    alignItems: 'center',
  },
  save: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  data: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 4,
  },
  instrucao: {
    fontSize: 18,
    color: '#000',
  },
  formtext: {
    height: 120,
    padding: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#d9d9d9',
    marginTop: 5,
    backgroundColor: 'white',
    fontSize: 18,
    textAlignVertical: 'top',
  },
  botaoCancelarTexto: {
    fontSize: 18,
    color: '#000',
  },
  botaoSalvarTexto: {
    fontSize: 18,
    color: 'white',
    marginTop: 2,
  },
  conteudoInferior: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContent: {
    flexGrow: 1,
  },
  tagInput: {
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 12,
    marginRight: 10,
    backgroundColor: 'white',
    fontSize: 18,
  },
  editarContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    flexWrap: 'nowrap',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tagWrapper: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  tagText: {
    fontSize: 18,
  },
  fecharTag: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'black',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    paddingBottom: 3,
  },
  fecharTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 16,
  },
  botaoEditar: {
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editarTexto: {
    fontSize: 16,
  },
  weekContainer: {
    borderRadius: 20,
    padding: 12,
    marginTop: 20,
    marginBottom: 30,
    marginLeft: 15,
    marginRight: 15,
  },
  weekItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  weekAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    backgroundColor: '#fff'
  },
  dayText: {
    marginTop: 4,
    fontSize: 14,
    color: "#444",
  },
  dayTextWrapper: {
    marginTop: 2,
    marginBottom: 2,
  },
});
