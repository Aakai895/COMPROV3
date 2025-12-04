import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Alert, TextInput, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseServices/firebaseConfig';
import FundoProfile from '../../Style/Backgrounds/Profile_Fundo';
import FundoEditarProfile from '../../Style/Backgrounds/FundoEditar';

export default function PerfilPaciente() {
  const navigation = useNavigation();
  const [abaAtiva, setAbaAtiva] = useState('Meus Dados');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [profileImage, setProfileImage] = useState(require('../../assets/Plano_Fundo/ExploreApp.jpg.png'));
  const [backgroundEditando, setBackgroundEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dadosPaciente, setDadosPaciente] = useState({
    nome: '',
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    estado: '',
    cidade: '',
    endereco: '',
    idade: ''
  });

  useEffect(() => {
    carregarDadosPaciente();
  }, []);

  const carregarDadosPaciente = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert('Erro', 'Usuário não logado');
        navigation.navigate('Login');
        return;
      }

      console.log('📊 Buscando dados do paciente:', user.uid);

      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        throw new Error("Dados do usuário não encontrados");
      }

      const basicData = userDoc.data();
      console.log('✅ Dados básicos:', basicData);

      const pacienteDoc = await getDoc(doc(db, "pacientes", user.uid));
      let pacienteData = {};
      
      if (pacienteDoc.exists()) {
        pacienteData = pacienteDoc.data();
        console.log('✅ Dados paciente:', pacienteData);
      }

      const dadosCombinados = {
        nome: basicData.nome || '',
        email: basicData.email || '',
        telefone: basicData.telefone || '',
        dataNascimento: pacienteData.dataNascimento ? 
          new Date(pacienteData.dataNascimento).toLocaleDateString('pt-BR') : '',
        sexo: pacienteData.sexo || '',
        idade: pacienteData.idade ? `${pacienteData.idade} anos` : '',
        estado: pacienteData.endereco?.estado || '',
        cidade: pacienteData.endereco?.cidade || '',
        endereco: pacienteData.endereco?.endereco || '',
        bio: pacienteData.bio || '',
        preferencias: pacienteData.preferencias || {}
      };

      setDadosPaciente(dadosCombinados);

      const imagemSalva = await AsyncStorage.getItem('profileImage');
      if (imagemSalva) {
        setProfileImage({ uri: imagemSalva });
      }

    } catch (error) {
      console.error('❌ Erro ao carregar dados do paciente:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil');
    } finally {
      setLoading(false);
    }
  };

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
        Alert.alert('Sucesso', 'Foto de perfil atualizada!');
      } catch (error) {
        console.error('Erro ao salvar imagem de perfil:', error);
      }
    }
  };

  const salvarEdicoes = async () => {
    try {
      setSaving(true);
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert('Erro', 'Usuário não logado');
        return;
      }

      console.log('💾 Salvando alterações do paciente...');

      await updateDoc(doc(db, "users", user.uid), {
        nome: dadosPaciente.nome,
        telefone: dadosPaciente.telefone,
        atualizadoEm: new Date()
      });

      await updateDoc(doc(db, "pacientes", user.uid), {
        sexo: dadosPaciente.sexo,
        bio: dadosPaciente.bio,
        endereco: {
          estado: dadosPaciente.estado,
          cidade: dadosPaciente.cidade,
          endereco: dadosPaciente.endereco
        },
        atualizadoEm: new Date()
      });

      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      setModoEdicao(false);
      setBackgroundEditando(false);

    } catch (error) {
      console.error('❌ Erro ao salvar dados:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.navigate('Login');
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
            }
          }
        }
      ]
    );
  };

  const renderCampo = (label, chave, editable = true) => (
    <View style={styles.cardCampo}>
      <Text style={styles.campoLabel}>{label}</Text>
      {modoEdicao && editable ? (
        <TextInput
          style={styles.inputCampo}
          value={dadosPaciente[chave]}
          onChangeText={(text) => setDadosPaciente({ ...dadosPaciente, [chave]: text })}
          placeholder={`Digite ${label.toLowerCase()}`}
        />
      ) : (
        <Text style={styles.campoValor}>
          {dadosPaciente[chave] || `Não ${label.toLowerCase()}`}
        </Text>
      )}
    </View>
  );

  const renderMeusDados = () => (
    <View style={styles.secao}>
      {renderCampo('Nome Completo', 'nome')}
      {renderCampo('Data de Nascimento', 'dataNascimento', false)}
      {renderCampo('Idade', 'idade', false)}
      {renderCampo('Sexo', 'sexo')}
      {renderCampo('Email', 'email', false)}
      {renderCampo('Telefone', 'telefone')}
      {renderCampo('Estado', 'estado')}
      {renderCampo('Cidade', 'cidade')}
      {renderCampo('Endereço', 'endereco')}

      <TouchableOpacity
        style={[styles.buttonSalvarEditar, saving && styles.buttonDisabled]}
        onPress={() => {
          if (modoEdicao) {
            salvarEdicoes();
          } else {
            setModoEdicao(true);
            setBackgroundEditando(true);
          }
        }}
        disabled={saving}
      >
        <View style={styles.buttonContent}>
          <View style={styles.iconWrapper}>
            <Image
              source={require('../../assets/icones/engrenagemIcon.png')}
              style={styles.iconEditar}
            />
          </View>
          <Text style={styles.buttonEditarText}>
            {saving ? 'Salvando...' : modoEdicao ? 'Salvar Perfil' : 'Editar Perfil'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Botão Sair */}
      <TouchableOpacity
        style={styles.buttonSair}
        onPress={handleLogout}
      >
        <Text style={styles.buttonSairText}>Sair da Conta</Text>
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <FundoProfile />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#44615f" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          onPress={() => navigation.goBack()}
        >
          <Image source={require('../../assets/icones/SetaVoltarBranca.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Meu Perfil
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
          <View style={styles.editImageOverlay}>
            <Text style={styles.editImageText}>Alterar Foto</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>
          {dadosPaciente.nome}
        </Text>
        <Text style={styles.userEmail}>
          {dadosPaciente.email}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#44615f',
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
    fontWeight: 'bold',
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
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#47667b',
    fontWeight: 'bold',
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
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonSair: {
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonSairText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  imageTouchable: {
    position: 'relative',
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  editImageText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
  },
  userName: {
    fontSize: 22,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
});