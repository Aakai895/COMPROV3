import React, { useState, useEffect } from 'react';
import {  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  Image, ScrollView, Alert, TextInput
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import FundoProfile from '../../Style/Backgrounds/Profile_Fundo';
import FundoEditarProfile from '../../Style/Backgrounds/FundoEditar';

export default function Perfil() {
  const navigation = useNavigation();
  const [abaAtiva, setAbaAtiva] = useState('Meus Dados');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [profileImage, setProfileImage] = useState(
    require('../../assets/Plano_Fundo/ExploreApp.jpg.png')
  );
  const [backgroundEditando, setBackgroundEditando] = useState(false);

  const dadosIniciais = {
    nome: 'Lorena Alvarado',
    nascimento: '10/10/2010',
    sexo: 'Feminino',
    email: 'lorenaalvarado@gmail.com',
    estado: 'SP',
    cidade: 'SP',
    endereco: 'Rosas Vermelhas, 2015',
  };

  const [dadosEditaveis, setDadosEditaveis] = useState(dadosIniciais);

  useEffect(() => {
    const carregarDadosSalvos = async () => {
      try {
        const imagemSalva = await AsyncStorage.getItem('profileImage');
        if (imagemSalva !== null) setProfileImage({ uri: imagemSalva });

        const dadosSalvos = await AsyncStorage.getItem('dadosUsuario');
        if (dadosSalvos !== null) setDadosEditaveis(JSON.parse(dadosSalvos));
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    };

    carregarDadosSalvos();
  }, []);

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Você precisa liberar acesso à galeria.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage({ uri });

      try {
        await AsyncStorage.setItem('profileImage', uri);
      } catch (error) {
        console.error('Erro ao salvar imagem de perfil:', error);
      }
    }
  };

  const salvarEdicoes = async () => {
    try {
      await AsyncStorage.setItem('dadosUsuario', JSON.stringify(dadosEditaveis));
      setModoEdicao(false);
      setBackgroundEditando(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  const renderCampo = (label, chave) => (
    <View style={styles.cardCampo}>
      <Text style={styles.campoLabel}>{label}</Text>
      {modoEdicao ? (
        <TextInput
          style={styles.inputCampo}
          value={dadosEditaveis[chave]}
          onChangeText={(text) => setDadosEditaveis({ ...dadosEditaveis, [chave]: text })}
        />
      ) : (
        <Text style={styles.campoValor}>{dadosEditaveis[chave]}</Text>
      )}
    </View>
  );

  const renderMeusDados = () => (
    <View style={styles.secao}>
      {renderCampo('Nome Completo', 'nome')}
      {renderCampo('Data de Nascimento', 'nascimento')}
      {renderCampo('Sexo', 'sexo')}
      {renderCampo('Email', 'email')}
      {renderCampo('Estado', 'estado')}
      {renderCampo('Cidade', 'cidade')}
      {renderCampo('Endereço (Rua, número)', 'endereco')}

      <TouchableOpacity
        style={styles.buttonSalvarEditar}
        onPress={() => {
          if (modoEdicao) {
            salvarEdicoes();
          } else {
            setModoEdicao(true);
            setBackgroundEditando(true);
          }
        }}
      >
        <View style={styles.buttonContent}>
          <View style={styles.iconWrapper}>
            <Image
              source={require('../../assets/icones/engrenagemIcon.png')}
              style={styles.iconEditar}
            />
          </View>
          <Text style={styles.buttonEditarText}>
            {modoEdicao ? 'Salvar Perfil' : 'Editar Perfil'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderDadosProtese = () => (
    <View style={styles.cardPergunta}>
      <Text style={styles.perguntaTexto}>
        Deseja adicionar os dados da sua prótese?
      </Text>

      <View style={styles.botoesContainer}>
        <TouchableOpacity
          style={[styles.botaoOpcao, styles.botaoSim]}
          onPress={() => navigation.navigate('AdicionarProtese')}
        >
          <Text style={styles.botaoOpcaoTextoSim}>Sim</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botaoOpcao, styles.botaoNao]}
          onPress={() => setAbaAtiva('Meus Dados')}
        >
          <Text style={styles.botaoOpcaoTextoNao}>Não</Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      {backgroundEditando ? (
       <FundoEditarProfile />
      ) : (
        <FundoProfile />
      )}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('TelasUsuario')}
        >
          <Image source={require('../../assets/icones/SetaVoltarBranca.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Perfil
        </Text>

        <TouchableOpacity style={styles.cartButton}
          onPress={() => navigation.navigate('Carrinho')}
        >
          <Image source={require('../../assets/icones/Carrinho_Verde.png')}
            style={styles.cartIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imageTouchable}>
          <Image source={profileImage} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
        <Text style={styles.userName}>
          {dadosEditaveis.nome}
        </Text>
      </View>

      <View style={styles.spacer} />

      <View style={styles.navTabs}>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <TouchableOpacity onPress={() => setAbaAtiva('Meus Dados')}
            style={styles.tabItem}
          >
            <Text style={[styles.tabText, abaAtiva === 'Meus Dados' && styles.activeTabText]}>
              Meus Dados
            </Text>
            {abaAtiva === 'Meus Dados' && <View style={styles.trapezio} />}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setAbaAtiva('Dados da Prótese')}
            style={styles.tabItem}
          >
            <Text style={[styles.tabText, abaAtiva === 'Dados da Prótese' && styles.activeTabText]}>
              Dados da Prótese
            </Text>
            {abaAtiva === 'Dados da Prótese' && <View style={styles.trapezio} />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} stickyHeaderIndices={[2]}>
        <View style={styles.conteudo}>
          {abaAtiva === 'Meus Dados' && renderMeusDados()}
          {abaAtiva === 'Dados da Prótese' && renderDadosProtese()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
    paddingTop: 35,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
  },
  cartButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: "#fff"
  },
  cartIcon: {
    width: 28,
    height: 28,
  },
  navTabs: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: "#fbfbfb"
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 20,
    color: '#000',
  },
  activeTabText: {
    color: '#47667b',
  },
  trapezio: {
    width: 100,
    height: 9,
    backgroundColor: '#47667b',
    marginTop: 6,
    transform: [{ scaleX: 1.6 }],
    borderTopLeftRadius: 95,
    borderTopRightRadius: 95,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingBottom: 10,
  },
  spacer: {
    height: 0,
  },
  conteudo: {
    marginTop: 10,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: "#fbfbfb"
  },
  secao: {
    marginTop: 10,
  },
  cardCampo: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: '#b1adad',
    width: '100%',
  },
  campoLabel: {
    fontSize: 14,
    color: '#737373',
    marginBottom: 4,
  },
  campoValor: {
    fontSize: 18,
    color: '#000',
  },
  inputCampo: {
    fontSize: 18,
    color: '#000',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 4,
  },
  buttonSalvarEditar: {
    backgroundColor: '#47667b',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 40,
    width: '100%',
  },
  cardPergunta: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#d9d9d9',
    marginTop: 10,
    width: '90%',
    maxWidth: 600,
    alignSelf: 'center',
    alignItems: 'center',
  },
  perguntaTexto: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  botoesContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  botaoOpcao: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoSim: {
    backgroundColor: '#47667b',
  },
  botaoNao: {
    backgroundColor: '#f8f4c4',
  },
  botaoOpcaoTextoNao: {
    color: '#47667b',
    fontSize: 18,
  },
  botaoOpcaoTextoSim: {
    color: '#fff',
    fontSize: 18,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
  },
  iconWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 6,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEditar: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  buttonEditarText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  profileImage: {
    height: 180,
    width: 180,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#44615f',
  },
  userName: {
    fontSize: 22,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
});
