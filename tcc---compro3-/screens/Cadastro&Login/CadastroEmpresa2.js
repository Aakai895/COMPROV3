import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView,
  TouchableWithoutFeedback, Keyboard, useWindowDimensions, StyleSheet,
  LayoutAnimation, Animated, Platform,} from 'react-native';
import CadastroFundo from '../../Style/Backgrounds/CadEmpresa_Fundo';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Eye, EyeOff } from 'lucide-react-native';
import { getResponsiveSizes } from '../../Style/Responsive';
import { useRoute } from '@react-navigation/native';

import { registerEmpresa } from '../../firebaseServices/authFirebase';

export default function CadastroEmpresaScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const {
    dotSize,
    buttonPaddingH,
    buttonPaddingV,
    logoWidth,
    logoHeight,
  } = getResponsiveSizes(width, height);
const route = useRoute();
const { dadosTela1 } = route.params || {};

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [especialidades, setEspecialidades] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [confirmarEmail, setConfirmarEmail] = useState('');

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

  setLoading(true);

  try {
    // Combinar dados da tela 1 e tela 2
    const dadosCompletos = {
      ...dadosTela1,
      especialidades,
      email,
      tipo: 'empresa'
    };

    await registerEmpresa(email, senha, dadosCompletos);
    
    alert('Empresa cadastrada com sucesso!');
    navigation.navigate('Login');
    
  } catch (error) {
    console.error('Erro no cadastro:', error);
    // ... tratamento de erro similar ao da clínica
  } finally {
    setLoading(false);
  }
};

  if (!fontsLoaded) return null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.wrapper}>
        <Animated.View style={[
            StyleSheet.absoluteFill,
            { transform: [{ translateY: animatedOffset }] },
          ]}
        >
          <CadastroFundo />
        </Animated.View>

        <TouchableOpacity
          onPress={() => navigation.navigate('CadastroEmpresa')}
          style={[styles.backButton, { top: insets.top + 10 }]}
        >
          <Image
            source={
              keyboardVisible
                ? require('../../assets/icones/SetaVoltarBranca.png')
                : require('../../assets/icones/SetaVoltar.png')
            }
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
              <Text style={styles.subtitle}>Fique tranquilo, estamos quase lá!</Text>
            </>
          )}
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer, {
              paddingBottom: insets.bottom + 10 + keyboardHeight,
              justifyContent: keyboardVisible ? 'flex-start' : 'flex-end',
              paddingTop: keyboardVisible ? 40 : 20,
            },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.loginTextWrapper}>
            <Text style={styles.loginShadow}>Cadastro</Text>
            <Text style={styles.loginText}>Cadastro</Text>
            <Text style={styles.empresaText}>Empresa</Text>
          </View>

          <Text style={[styles.label, { color: textColor }]}>
            Especialidades oferecidas <Text style={{ color: '#ff788a' }}>*</Text>
          </Text>
          <TextInput
            placeholder="Ex.: Manutenção"
            placeholderTextColor={placeholderColor}
            style={[styles.input, { borderColor, color: textColor }]}
            value={especialidades}
            onChangeText={setEspecialidades}
          />

          <Text style={[styles.label, { color: textColor }]}>
            Email <Text style={{ color: '#ff788a' }}>*</Text>
          </Text>
          <TextInput
            placeholder="Digite aqui..."
            placeholderTextColor={placeholderColor}
            style={[styles.input, { borderColor, color: textColor }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={[styles.label, { color: textColor }]}>
            Senha <Text style={{ color: '#ff788a' }}>*</Text>
          </Text>
          <View style={[styles.passwordWrapper, { borderColor }]}>
            <TextInput
              placeholder="Digite aqui..."
              placeholderTextColor={placeholderColor}
              secureTextEntry={!passwordVisible}
              style={[styles.passwordInput, { color: textColor }]}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <Eye color={iconColor} size={25} /> : <EyeOff color={iconColor} size={25} />}
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { color: textColor }]}>
            Confirmar Email <Text style={{ color: '#ff788a' }}>*</Text>
          </Text>
          <View style={[styles.passwordWrapper, { borderColor }]}>
            <TextInput
              placeholder="Digite aqui..."
              placeholderTextColor={placeholderColor}
              secureTextEntry={!confirmPasswordVisible}
              style={[styles.passwordInput, { color: textColor }]}
              value={confirmarEmail}
              onChangeText={setConfirmarEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <Text style={[styles.label, { color: textColor }]}>
            Confirmar Senha <Text style={{ color: '#ff788a' }}>*</Text>
          </Text>
          <View style={[styles.passwordWrapper, { borderColor }]}>
            <TextInput
              placeholder="Digite aqui..."
              placeholderTextColor={placeholderColor}
              secureTextEntry={!confirmPasswordVisible}
              style={[styles.passwordInput, { color: textColor }]}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
            <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              {confirmPasswordVisible ? <Eye color={iconColor} size={25} /> : <EyeOff color={iconColor} size={25} />}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleCadastrar}
            style={[styles.loginButton, { paddingHorizontal: buttonPaddingH, paddingVertical: buttonPaddingV }]}
          >
            <Text style={styles.loginTextButton}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
