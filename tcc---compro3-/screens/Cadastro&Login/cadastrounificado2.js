import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, Keyboard, useWindowDimensions, StyleSheet, LayoutAnimation, Animated, Platform, Alert } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CadastroFundo from '../../Style/Backgrounds/CadEmpresa_Fundo';
import { getResponsiveSizes } from '../../Style/Responsive';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseServices/firebaseConfig';

const estadosECidades = {
  SP: ['São Paulo', 'Osasco', 'Taboão da Serra', 'Embu das Artes', 'Cotia'],
  RJ: ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'Nova Iguaçu'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora'],
  BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari'],
  RS: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Santa Maria'],
};

export default function CadastroDadosScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { dadosTela1 } = route.params || {};
  
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { dotSize, buttonPaddingH, buttonPaddingV, logoWidth, logoHeight } = getResponsiveSizes(width, height);

  const [loading, setLoading] = useState(false);
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [dataNascimento, setDataNascimento] = useState(null);
  const [sexo, setSexo] = useState('Masculino');
  const [empresa, setEmpresa] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [afe, setAfe] = useState('');
  const [especialidades, setEspecialidades] = useState('');
  const [estado, setEstado] = useState('SP');
  const [cidade, setCidade] = useState(estadosECidades.SP[0]);  
  const [endereco, setEndereco] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const animatedOffset = useRef(new Animated.Value(0)).current;
  
  const [fontsLoaded] = useFonts({
    Alice: require('../../fonts/Alice-Regular.ttf'),
    Findel: require('../../fonts/Findel-Display-Regular.otf'),
  });

  useEffect(() => {
    console.log("Estado:", estado);
    console.log("Cidade:", cidade);
  }, [estado, cidade]);

  useEffect(() => {
    const onShow = (e) => {
      const h = e.endCoordinates?.height || 0;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardHeight(h);
      Animated.spring(animatedOffset, {
        toValue: -h * 0.25,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }).start();
    };
    
    const onHide = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardHeight(0);
      Animated.spring(animatedOffset, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }).start();
    };
    
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showListener = Keyboard.addListener(showEvent, onShow);
    const hideListener = Keyboard.addListener(hideEvent, onHide);
    
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [animatedOffset]);

  const handleEstadoChange = (value) => {
    setEstado(value);
    if (estadosECidades[value] && estadosECidades[value].length > 0) {
      setCidade(estadosECidades[value][0]);
    }
  };

  const keyboardVisible = keyboardHeight > 0;
  const textColor = keyboardVisible ? '#fff' : '#aaa';
  const borderColor = keyboardVisible ? '#fff' : '#ccc';
  const placeholderColor = keyboardVisible ? '#fff' : '#aaa';
  const iconColor = keyboardVisible ? '#fff' : '#aaa';

  const handleCadastrar = async () => {
    console.log('🎯 SALVANDO EM COLETAS ESPECÍFICAS...');
    
    if (!senha || !confirmarSenha) {
      alert('Preencha a senha e confirmação.');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    if (!dadosTela1) {
      alert('Dados da tela anterior não encontrados.');
      return;
    }

    if (dadosTela1.tipoUsuario === 'paciente' && !dataNascimento) {
      alert('Data de nascimento é obrigatória para pacientes.');
      return;
    }

    if ((dadosTela1.tipoUsuario === 'empresa' || dadosTela1.tipoUsuario === 'clinica') && (!empresa || !cnpj)) {
      alert('Nome da empresa e CNPJ são obrigatórios.');
      return;
    }

    if (dadosTela1.tipoUsuario === 'clinica' && !afe) {
      alert('AFE é obrigatória para clínicas.');
      return;
    }

    setLoading(true);

    try {
      console.log('📧 Criando usuário no Auth...');
      
      const userCredential = await createUserWithEmailAndPassword(auth, dadosTela1.email, senha);
      const user = userCredential.user;
      console.log('✅ Usuário criado:', user.uid);

      const dadosBasicos = {
        uid: user.uid,
        nome: dadosTela1.nome,
        email: dadosTela1.email,
        telefone: dadosTela1.telefone || '',
        tipo: dadosTela1.tipoUsuario,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        ativo: true,
        emailVerificado: false,
        perfilCompleto: true,
        ultimoAcesso: new Date()
      };

      console.log('💾 Salvando dados básicos em "users"...');
      await setDoc(doc(db, "users", user.uid), dadosBasicos);

      let colecaoEspecifica = '';
      let dadosEspecificos = {};

      switch(dadosTela1.tipoUsuario) {
        case 'paciente':
          colecaoEspecifica = 'pacientes';
          dadosEspecificos = {
            uid: user.uid,
            dataNascimento: dataNascimento.toISOString(),
            sexo: sexo,
            idade: calcularIdade(dataNascimento),
            fotoPerfil: '',
            bio: '',
            preferencias: {},
            historicoConsultas: [],
            emocoesRegistradas: [],
            criadoEm: new Date(),
            atualizadoEm: new Date()
          };
          break;

        case 'empresa':
          colecaoEspecifica = 'empresas';
          dadosEspecificos = {
            uid: user.uid,
            empresa: empresa,
            cnpj: cnpj,
            especialidades: especialidades || '',
            tipoEmpresa: 'geral',
            ramo: especialidades || '',
            site: '',
            redesSociais: {},
            horarioFuncionamento: '',
            descricao: '',
            servicosOferecidos: [],
            endereco: {
              estado: estado || '',
              cidade: cidade || '',
              endereco: endereco || '',
              cep: '',
              complemento: ''
            },
            criadoEm: new Date(),
            atualizadoEm: new Date()
          };
          break;

        case 'clinica':
          colecaoEspecifica = 'clinicas';
          dadosEspecificos = {
            uid: user.uid,
            empresa: empresa,
            cnpj: cnpj,
            afe: afe,
            especialidades: especialidades ? especialidades.split(',').map(e => e.trim()) : [],
            tipoClinica: 'psicologia',
            site: '',
            redesSociais: {},
            descricao: '',
            horarioAtendimento: '',
            convenios: [],
            profissionais: [],
            endereco: {
              estado: estado || '',
              cidade: cidade || '',
              endereco: endereco || '',
              cep: '',
              complemento: ''
            },
            criadoEm: new Date(),
            atualizadoEm: new Date()
          };
          break;
      }

      console.log(`💾 Salvando dados específicos em "${colecaoEspecifica}"...`);
      await setDoc(doc(db, colecaoEspecifica, user.uid), dadosEspecificos);

      console.log('✅ DADOS SALVOS EM DUAS COLETAS!');
      
      Alert.alert(
        'Sucesso!', 
        'Cadastro realizado com sucesso! Faça login para continuar.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
      
    } catch (error) {
      console.error('❌ ERRO NO CADASTRO:', error);
      
      let errorMessage = 'Erro ao cadastrar. Tente novamente.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso.';
      } else if (error.code === 'auth/weak-password') {
         errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  function calcularIdade(dataNascimento) {
    if (!dataNascimento) return null;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }

  function formatarData(date) {
    if (!date) return '';
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  const renderCamposEspecificos = () => {
    if (!dadosTela1) return null;

    switch(dadosTela1.tipoUsuario) {
      case 'paciente':
        return (
          <>
            <View style={styles.row}>
              <View style={[styles.column, { marginRight: 10 }]}>
                <Text style={[styles.label, { color: textColor }]}>
                  Data Nasc. <Text style={{ color: '#ff788a' }}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={[styles.input, { borderColor, justifyContent: 'center' }]}
                >
                  <Text style={{ color: dataNascimento ? textColor : placeholderColor }}>
                    {dataNascimento ? formatarData(dataNascimento) : '00/00/0000'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.column}>
                <Text style={[styles.label, { color: textColor }]}>Sexo</Text>
                <View style={[styles.input, { borderColor }]}>
                  <Picker
                    selectedValue={sexo}
                    style={[styles.picker, { color: textColor }]}
                    dropdownIconColor={iconColor}
                    onValueChange={setSexo}
                  >
                    <Picker.Item label="Masculino" value="Masculino" />
                    <Picker.Item label="Feminino" value="Feminino" />
                    <Picker.Item label="Outro" value="Outro" />
                  </Picker>
                </View>
              </View>
            </View>
          </>
        );

      case 'empresa':
        return (
          <>
            <Text style={[styles.label, { color: textColor }]}>
              Nome Empresa <Text style={{ color: '#ff788a' }}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, { borderColor, color: textColor }]}
              placeholder="Digite aqui..."
              placeholderTextColor={placeholderColor}
              value={empresa}
              onChangeText={setEmpresa}
            />

            <Text style={[styles.label, { color: textColor }]}>
              CNPJ <Text style={{ color: '#ff788a' }}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, { borderColor, color: textColor }]}
              placeholder="00.000.000/0000-00"
              placeholderTextColor={placeholderColor}
              value={cnpj}
              onChangeText={setCnpj}
              keyboardType="numeric"
            />

            <Text style={[styles.label, { color: textColor }]}>Especialidades</Text>
            <TextInput
              style={[styles.input, { borderColor, color: textColor }]}
              placeholder="Ex.: Manutenção, Consultoria"
              placeholderTextColor={placeholderColor}
              value={especialidades}
              onChangeText={setEspecialidades}
            />
          </>
        );

      case 'clinica':
        return (
          <>
            <Text style={[styles.label, { color: textColor }]}>
              Nome Clínica <Text style={{ color: '#ff788a' }}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, { borderColor, color: textColor }]}
              placeholder="Digite aqui..."
              placeholderTextColor={placeholderColor}
              value={empresa}
              onChangeText={setEmpresa}
            />

            <Text style={[styles.label, { color: textColor }]}>
              CNPJ <Text style={{ color: '#ff788a' }}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, { borderColor, color: textColor }]}
              placeholder="00.000.000/0000-00"
              placeholderTextColor={placeholderColor}
              value={cnpj}
              onChangeText={setCnpj}
              keyboardType="numeric"
            />

            <Text style={[styles.label, { color: textColor }]}>
              AFE <Text style={{ color: '#ff788a' }}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, { borderColor, color: textColor }]}
              placeholder="Número da AFE"
              placeholderTextColor={placeholderColor}
              value={afe}
              onChangeText={setAfe}
            />

            <Text style={[styles.label, { color: textColor }]}>Especialidades</Text>
            <TextInput
              style={[styles.input, { borderColor, color: textColor }]}
              placeholder="Ex.: Psicologia, Psiquiatria"
              placeholderTextColor={placeholderColor}
              value={especialidades}
              onChangeText={setEspecialidades}
            />

            <View style={styles.row}>
              <View style={[styles.column, { marginRight: 10 }]}>
                <Text style={[styles.label, { color: textColor }]}>Estado</Text>
                <View style={[styles.input, { borderColor }]}>
                  <Picker
                    selectedValue={estado}
                    style={[styles.picker, { color: textColor }]}
                    dropdownIconColor={iconColor}
                    onValueChange={handleEstadoChange}
                  >
                    {Object.keys(estadosECidades).map((estadoKey) => (
                      <Picker.Item key={estadoKey} label={estadoKey} value={estadoKey} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.column}>
                <Text style={[styles.label, { color: textColor }]}>Cidade</Text>
                <View style={[styles.input, { borderColor }]}>
                  <Picker
                    selectedValue={cidade}
                    style={[styles.picker, { color: textColor }]}
                    dropdownIconColor={iconColor}
                    onValueChange={setCidade}
                  >
                    {estadosECidades[estado]?.map((cidadeItem) => (
                      <Picker.Item key={cidadeItem} label={cidadeItem} value={cidadeItem} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <Text style={[styles.label, { color: textColor }]}>Endereço</Text>
            <TextInput
              style={[styles.input, { borderColor, color: textColor }]}
              placeholder="Rua, número"
              placeholderTextColor={placeholderColor}
              value={endereco}
              onChangeText={setEndereco}
            />
          </>
        );

      default:
        return null;
    }
  };

  if (!fontsLoaded) return null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.wrapper}>
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY: animatedOffset }] }]}>
          <CadastroFundo />
        </Animated.View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { top: insets.top + 10 }]}
        >
          <Image
            source={keyboardVisible ? require('../../assets/icones/SetaVoltarBranca.png') : require('../../assets/icones/SetaVoltar.png')}
            style={[styles.backIcon, keyboardVisible ? undefined : { tintColor: '#000' }]}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginTop: keyboardVisible ? 10 : height * 0.08 }}>
          {!keyboardVisible && (
            <>
              <Image
                source={require('../../assets/Logo.png')}
                style={{ width: logoWidth, height: logoHeight, resizeMode: 'contain' }}
              />
              <Text style={styles.gratidao}>
                Agora vamos finalizar seu cadastro{'\n'}com informações específicas.
              </Text>
            </>
          )}
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer, {
              paddingBottom: insets.bottom + 30 + keyboardHeight,
              justifyContent: keyboardVisible ? 'flex-start' : 'flex-end',
              paddingTop: keyboardVisible ? 40 : 20,
            },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerWrapper}>
            <Text style={styles.tituloShadow}>Cadastro</Text>
            <Text style={styles.tituloText}>Cadastro</Text>
            <Text style={styles.tipoText}>
              {dadosTela1?.tipoUsuario === 'paciente' ? 'Dados Pessoais' : 
               dadosTela1?.tipoUsuario === 'empresa' ? 'Dados da Empresa' : 'Dados da Clínica'}
            </Text>
          </View>

          {renderCamposEspecificos()}

          <Text style={[styles.label, { color: textColor }]}>
            Senha <Text style={{ color: '#ff788a' }}>*</Text>
          </Text>
          <View style={[styles.passwordWrapper, { borderColor }]}>
            <TextInput
              placeholder="Digite sua senha..."
              placeholderTextColor={placeholderColor}
              secureTextEntry={!passwordVisible}
              style={[styles.passwordInput, { color: textColor }]}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? 
                <Ionicons name="eye-off" color={iconColor} size={25} /> : 
                <Ionicons name="eye" color={iconColor} size={25} />
              }
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { color: textColor }]}>
            Confirmar Senha <Text style={{ color: '#ff788a' }}>*</Text>
          </Text>
          <View style={[styles.passwordWrapper, { borderColor }]}>
            <TextInput
              placeholder="Digite novamente..."
              placeholderTextColor={placeholderColor}
              secureTextEntry={!confirmPasswordVisible}
              style={[styles.passwordInput, { color: textColor }]}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
            <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              {confirmPasswordVisible ? 
                <Ionicons name="eye-off" color={iconColor} size={25} /> : 
                <Ionicons name="eye" color={iconColor} size={25} />
              }
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dataNascimento || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) setDataNascimento(selectedDate);
              }}
            />
          )}

          <TouchableOpacity
            onPress={handleCadastrar}
            disabled={loading}
            style={[
              styles.loginButton, 
              { 
                paddingHorizontal: buttonPaddingH, 
                paddingVertical: buttonPaddingV,
                opacity: loading ? 0.6 : 1
              }
            ]}
          >
            <Text style={styles.loginTextButton}>
              {loading ? 'Finalizando...' : 'Finalizar Cadastro'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('CadastroTipo')}>
            <Text style={styles.registerText}>
              Voltar para informações básicas
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const INPUT_HEIGHT = 45;

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 99,
    padding: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  gratidao: {
    textAlign: 'center',
    color: '#000',
    fontFamily: 'Alice',
    marginVertical: 10,
  },
  scrollContainer: { paddingHorizontal: 30 },
  headerWrapper: {
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
    zIndex: 10,
  },
  tituloShadow: {
    position: 'absolute',
    top: 0,
    left: 3,
    fontSize: 36,
    color: '#a5c3a7',
    fontFamily: 'Findel',
    textAlign: 'center',
  },
  tituloText: {
    fontSize: 36,
    color: '#44615f',
    fontFamily: 'Findel',
    textAlign: 'center',
  },
  tipoText: {
    fontSize: 20,
    color: '#44615f',
    fontFamily: 'Findel',
    textAlign: 'center',
  },
  label: {
    fontFamily: 'Alice',
    fontSize: 14,
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    fontFamily: 'Alice',
    fontSize: 14,
    minHeight: INPUT_HEIGHT,
    marginBottom: 12,
    justifyContent: 'center',
  },
  picker: {
    height: INPUT_HEIGHT,
    fontFamily: 'Alice',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 12,
    minHeight: INPUT_HEIGHT,
  },
  passwordInput: {
    flex: 1,
    fontFamily: 'Alice',
    fontSize: 14,
  },
  loginButton: {
    alignSelf: 'center',
    borderColor: '#a5c3a7',
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginTextButton: {
    color: '#fff',
    fontFamily: 'Alice',
  },
  registerText: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Alice',
    marginBottom: 10,
  },
  column: {
    flex: 1,
  },
});

