import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView,
  TouchableWithoutFeedback, Keyboard, useWindowDimensions, StyleSheet,
  LayoutAnimation, Animated, Platform,} from 'react-native';
import CadastroFundo from '../../Style/Backgrounds/CadEmpresa_Fundo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Eye, EyeOff } from 'lucide-react-native';
import { getResponsiveSizes } from '../../Style/Responsive';

import { registerClinica } from '../../firebaseServices/authFirebase';

export default function CadastroClinica2Screen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const {
    dotSize,
    buttonPaddingH,
    buttonPaddingV,
    logoWidth,
    logoHeight,
  } = getResponsiveSizes(width, height);

  // Receber dados da tela anterior
  const { dadosTela1 } = route.params || {};

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [especialidades, setEspecialidades] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [confirmarEmail, setConfirmarEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const animatedOffset = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    Alice: require('../../fonts/Alice-Regular.ttf'),
    Findel: require('../../fonts/Findel-Display-Regular.otf'),
  });

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

  const keyboardVisible = keyboardHeight > 0;
  const textColor = keyboardVisible ? '#fff' : '#aaa';
  const borderColor = keyboardVisible ? '#fff' : '#ccc';
  const placeholderColor = keyboardVisible ? '#fff' : '#aaa';
  const iconColor = keyboardVisible ? '#fff' : '#aaa';

  const handleCadastrar = async () => {
    if (!especialidades || !email || !senha || !confirmarSenha || !confirmarEmail) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (email !== confirmarEmail) {
      alert('Os emails não coincidem!');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    if (senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    setLoading(true);

    try {
      // Combinar dados da tela 1 e tela 2
      const dadosCompletos = {
        ...dadosTela1,
        especialidades,
        email,
        tipo: 'clinica'
      };

      console.log('Tentando cadastrar clínica...', dadosCompletos);

      // Chamar função do Firebase
      await registerClinica(email, senha, dadosCompletos);
      
      alert('Clínica cadastrada com sucesso!');
      navigation.navigate('Login');
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      let errorMessage = 'Erro ao cadastrar. Tente novamente.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Senha muito fraca.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.wrapper}>
        {/* ... (resto do código permanece igual) ... */}
        
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
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Text>
        </TouchableOpacity>

        {/* ... (resto do código permanece igual) ... */}
      </View>
    </TouchableWithoutFeedback>
  );
}


const INPUT_HEIGHT = 50;

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: 'transparent' },
  subtitle: {
    textAlign: 'center',
    fontFamily: 'Alice',
    color: '#000',
    marginTop: 10,
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
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 30,
  },
  loginTextWrapper: { 
    alignSelf: 'center', 
    zIndex: 10 
  },
  loginText: { 
    fontSize: 36, 
    color: '#44615f', 
    fontFamily: 'Findel', 
    textAlign: 'center' 
  },
  empresaText: { 
    fontSize: 20, 
    color: '#44615f', 
    fontFamily: 'Findel', 
    textAlign: 'center' 
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
    gap: 20,
  },
  socialButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
