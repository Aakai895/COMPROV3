import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, ScrollView,
  TouchableWithoutFeedback, Keyboard, useWindowDimensions, StyleSheet,
  LayoutAnimation, Animated, Platform,
} from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Eye, EyeOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CadastroFundo from '../../Style/Backgrounds/CadUsuario_Fundo';
import { getResponsiveSizes } from '../../Style/Responsive';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import { registerUser } from '../../services/AuthFirebase';

export default function CadastroUsuario2() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
const route = useRoute();
const { dadosTela1 } = route.params || {};
  const {
    subtitleFontSize,
    dotSize,
    buttonPaddingH,
    buttonPaddingV,
    logoWidth,
    logoHeight,
  } = getResponsiveSizes(width, height);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [estado, setEstado] = useState('SP');
  const [cidade, setCidade] = useState('São Paulo');
  const [endereco, setEndereco] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [senhaConfirm, setSenhaConfirm] = useState('');

  const animatedOffset = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    Alice: require('../../fonts/Alice-Regular.ttf'),
    Findel: require('../../fonts/Findel-Display-Regular.otf'),
  });

  const estadosECidades = {
    SP: ['Osasco', 'Taboão da Serra', 'Embu das Artes', 'Cotia', 'São Paulo', 'Itapecerica da Serra'],
    RJ: ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'Nova Iguaçu'],
    MG: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora'],
    BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari'],
    RS: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Santa Maria'],
  };

  useEffect(() => {
    const onShow = (e) => {
      const h = e.endCoordinates?.height || 0;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardHeight(h);
      Animated.spring(animatedOffset, {
        toValue: -h * 0.39,
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

  const keyboardVisible = keyboardHeight > 0;

  const textColor = keyboardVisible ? '#fff' : '#aaa';
  const borderColor = keyboardVisible ? '#fff' : '#ccc';
  const placeholderColor = keyboardVisible ? '#fff' : '#aaa';
  const iconColor = keyboardVisible ? '#fff' : '#aaa';

  const handleCadastrar = async () => {
  if (!estado || !cidade || !endereco.trim() || !emailConfirm.trim() || !senhaConfirm.trim()) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  if (dadosTela1.email !== emailConfirm) {
    alert('Os emails não coincidem!');
    return;
  }

  if (dadosTela1.senha !== senhaConfirm) {
    alert('As senhas não coincidem!');
    return;
  }

  setLoading(true);

  try {
    // Combinar dados da tela 1 e tela 2
    const dadosCompletos = {
      ...dadosTela1,
      estado,
      cidade,
      endereco,
      tipo: 'usuario'
    };

    await registerUser(dadosTela1.email, dadosTela1.senha, dadosCompletos);
    
    alert('Usuário cadastrado com sucesso!');
    navigation.navigate('Login');
    
  } catch (error) {
    console.error('Erro no cadastro:', error);
    // ... tratamento de erro
  } finally {
    setLoading(false);
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
          onPress={() => navigation.navigate('CadastroUsuario')}
          style={[styles.backButton, { top: insets.top + 10 }]}
        >
          <Image
            source={keyboardVisible
              ? require('../../assets/icones/SetaVoltarBranca.png')
              : require('../../assets/icones/SetaVoltar.png')}
            style={[styles.backIcon, keyboardVisible ? {} : { tintColor: '#000' }]}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={[styles.header, { marginTop: keyboardVisible ? 10 : height * 0.08 }]}>
          {!keyboardVisible && (
            <>
              <Image
                source={require('../../assets/Logo.png')}
                style={{ width: logoWidth, height: logoHeight, resizeMode: 'contain' }}
              />
              <Text style={[styles.subtitle, { fontSize: subtitleFontSize }]}>
                Fique tranquilo, estamos quase lá
              </Text>
            </>
          )}
        </View>

        <ScrollView contentContainerStyle={[
          styles.scrollContainer,
            {
              paddingBottom: insets.bottom + 30 + keyboardHeight,
              justifyContent: keyboardVisible ? 'flex-start' : 'flex-end',
            },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.loginTextWrapper, { marginTop: keyboardVisible ? 50 : 20 }]}>
            <Text style={styles.loginShadow}>Cadastro</Text>
            <Text style={styles.loginText}>Cadastro</Text>
            <Text style={styles.usuarioText}>Usuário</Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.column, { marginRight: 10 }]}>
              <Text style={[styles.label, { color: textColor }]}>
                Estado <Text style={{ color: '#ff788a' }}>*</Text>
              </Text>
              <View style={[styles.input, { borderColor }]}>
                <Picker
                  selectedValue={estado}
                  style={[styles.picker, { color: textColor }]}
                  dropdownIconColor={iconColor}
                  onValueChange={(value) => {
                    setEstado(value);
                    setCidade(estadosECidades[value][0]);
                  }}
                >
                  {Object.keys(estadosECidades).map((estadoKey) => (
                    <Picker.Item key={estadoKey} label={estadoKey} value={estadoKey} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.column}>
              <Text style={[styles.label, { color: textColor }]}>
                Cidade <Text style={{ color: '#ff788a' }}>*</Text>
              </Text>
              <View style={[styles.input, { borderColor }]}>
                <Picker
                  selectedValue={cidade}
                  style={[styles.picker, { color: textColor }]}
                  dropdownIconColor={iconColor}
                  onValueChange={setCidade}
                >
                  {estadosECidades[estado].map((cidadeItem) => (
                    <Picker.Item key={cidadeItem} label={cidadeItem} value={cidadeItem} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <Text style={[styles.label, { color: textColor }]}>
            Endereço (Rua, número) <Text style={{ color: '#ff788a' }}>*</Text>
          </Text>
          <TextInput
            placeholder="Ex.: Praça Miguel Ortega, 135"
            placeholderTextColor={placeholderColor}
            style={[styles.input, { borderColor, color: textColor }]}
            value={endereco}
            onChangeText={setEndereco}
          />

          <Text style={[styles.label, { color: textColor }]}>
            Confirmar Email <Text style={{ color: '#ff788a' }}>*</Text>
          </Text>
          <TextInput
            placeholder="Digite aqui..."
            placeholderTextColor={placeholderColor}
            style={[styles.input, { borderColor, color: textColor }]}
            value={emailConfirm}
            onChangeText={setEmailConfirm}
          />

          <Text style={[styles.label, { color: textColor }]}>
            Confirmar Senha <Text style={{ color: '#ff788a' }}>*</Text>
          </Text>
          <View style={[styles.passwordWrapper, { borderColor }]}>
            <TextInput
              placeholder="Digite aqui..."
              placeholderTextColor={placeholderColor}
              secureTextEntry={!passwordVisible}
              style={[styles.passwordInput, { color: textColor }]}
              value={senhaConfirm}
              onChangeText={setSenhaConfirm}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <Eye color={iconColor} size={25} /> : <EyeOff color={iconColor} size={25} />}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleCadastrar}
            style={[styles.loginButton, { paddingHorizontal: buttonPaddingH, paddingVertical: buttonPaddingV }]}
          >
            <Text style={styles.loginTextButton}>
              Cadastrar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login', {origem: 'Usuario'})}>
            <Text style={styles.registerText}>
              Já possui uma conta? <Text style={styles.cadastroBold}>Logar</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.orText}>Ou continue com</Text>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <AntDesign name="google" size={dotSize * 4} color="#787876" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="apple" size={dotSize * 4} color="#787876" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const INPUT_HEIGHT = 50;

const styles = StyleSheet.create({
  wrapper: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
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
  header: {
    alignItems: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontFamily: 'Alice',
    color: '#000',
    marginTop: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 30,
  },
  loginTextWrapper: {
    alignSelf: 'center',
    zIndex: 10,
  },
  loginText: {
    fontSize: 36,
    color: '#44615f',
    fontFamily: 'Findel',
    textAlign: 'center',
  },
  usuarioText: {
    fontSize: 20,
    color: '#44615f',
    fontFamily: 'Findel',
    textAlign: 'center',
  },
  loginShadow: {
    position: 'absolute',
    top: 0,
    left: 3,
    fontSize: 36,
    color: '#a5c3a7',
    fontFamily: 'Findel',
    textAlign: 'center',
  },
  label: {
    marginBottom: 5,
    marginTop: 5,
    fontFamily: 'Alice',
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    fontFamily: 'Alice',
    minHeight: INPUT_HEIGHT,
    justifyContent: 'center',
    marginBottom: 20,
  },
  picker: {
    height: INPUT_HEIGHT,
    fontFamily: 'Alice',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  column: {
    flex: 1,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 20,
    minHeight: INPUT_HEIGHT,
  },
  passwordInput: {
    flex: 1,
    fontFamily: 'Alice',
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
  cadastroBold: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#ff788a',
  },
  orText: {
    textAlign: 'center',
    color: '#aaa',
    fontFamily: 'Alice',
    marginVertical: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});
