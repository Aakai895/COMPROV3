import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image,
  Platform, ScrollView, TouchableWithoutFeedback, Keyboard, 
  useWindowDimensions, LayoutAnimation, Animated, Alert} from 'react-native';
import Background from '../../Style/Backgrounds/Login_Fundo';
import Checkbox from 'expo-checkbox';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Eye, EyeOff } from 'lucide-react-native';
import { useFonts } from 'expo-font';
import { getResponsiveSizes } from '../../Style/Responsive';
import { useNavigation } from '@react-navigation/native';
import { 
  loginUser, 
  loginEmpresa, 
  loginClinica 
} from '../../firebaseServices';

export default function LoginScreen() { 
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  const {
    subtitleFontSize,
    captionFontSize,
    dotSize,
    buttonPaddingH,
    buttonPaddingV,
    buttonFontSize,
    logoWidth,
    logoHeight,
  } = getResponsiveSizes(width, height);

  const [isChecked, setChecked] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
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
        toValue: -h * 0.71,
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

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [animatedOffset]);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      console.log('Tentando login com:', email);
      
      // Tentar login como Usuário primeiro
      try {
        const userCredential = await loginUser(email, senha);
        console.log('Login usuário bem-sucedido:', userCredential.user.uid);
        navigation.navigate('TelasUsuario', { screen: 'Home' });
        return;
      } catch (userError) {
        console.log('Não é usuário:', userError.code);
      }

      // Tentar login como Empresa
      try {
        const empresaCredential = await loginEmpresa(email, senha);
        console.log('Login empresa bem-sucedido:', empresaCredential.user.uid);
        navigation.navigate('TelasCE', { screen: 'HomeCE' });
        return;
      } catch (empresaError) {
        console.log('Não é empresa:', empresaError.code);
      }

      // Tentar login como Clínica
      try {
        const clinicaCredential = await loginClinica(email, senha);
        console.log('Login clínica bem-sucedido:', clinicaCredential.user.uid);
        navigation.navigate('TelasCE', { screen: 'HomeCE' });
        return;
      } catch (clinicaError) {
        console.log('Não é clínica:', clinicaError.code);
      }

      // Se nenhum login funcionou
      Alert.alert(
        'Erro no Login',
        'Email ou senha incorretos. Verifique suas credenciais.',
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Erro geral no login:', error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro inesperado. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Função alternativa mais simples (se preferir)
  const handleLoginSimple = async () => {
    if (!email.trim() || !senha.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      // Ordem de tentativa: Usuário → Empresa → Clínica
      const authAttempts = [
        { auth: loginUser, type: 'usuário', route: 'TelasUsuario' },
        { auth: loginEmpresa, type: 'empresa', route: 'TelasCE' },
        { auth: loginClinica, type: 'clínica', route: 'TelasCE' }
      ];

      for (const attempt of authAttempts) {
        try {
          const result = await attempt.auth(email, senha);
          console.log(`Login ${attempt.type} bem-sucedido:`, result.user.uid);
          
          // Navegar para a tela correta
          navigation.navigate(attempt.route, { 
            screen: attempt.route === 'TelasUsuario' ? 'Home' : 'HomeCE',
            params: { userType: attempt.type }
          });
          return;
        } catch (error) {
          console.log(`Não é ${attempt.type}:`, error.code);
          continue; // Continua para a próxima tentativa
        }
      }

      // Se chegou aqui, nenhum login funcionou
      Alert.alert(
        'Login Inválido',
        'Email ou senha incorretos. Verifique suas credenciais.',
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert(
        'Erro',
        'Não foi possível fazer login. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) return null;

  const keyboardVisible = keyboardHeight > 0;
  const inputTextColor = keyboardVisible ? '#fff' : '#b1adad';
  const checkboxLabelColor = keyboardVisible ? '#fff' : '#b1adad';
  const forgotPasswordColor = keyboardVisible ? '#fff' : '#b1adad';
  const orTextColor = keyboardVisible ? '#fff' : '#b1adad';
  const iconColor = keyboardVisible ? '#fff' : '#aaa';

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.outerContainer}>
        <Animated.View style={[
          StyleSheet.absoluteFill,
            { transform: [{ translateY: animatedOffset }] },
          ]}
        >
          <Background />
        </Animated.View>

        <View style={[styles.header, { marginTop: keyboardVisible ? 20 : height * 0.08 }]}>
          {!keyboardVisible && (
            <>
              <Image
                source={require('../../assets/Logo.png')}
                style={{ width: logoWidth, height: logoHeight, resizeMode: 'contain' }}
              />
              <Text style={[styles.welcome, { fontSize: subtitleFontSize }]}>
                Seja bem-vindo de volta{'\n'}sentimos sua falta!
              </Text>
            </>
          )}
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer, {
              paddingHorizontal: 30,
              paddingTop: 30,
              paddingBottom: 40 + keyboardHeight,
              justifyContent: keyboardVisible ? 'flex-start' : 'flex-end',
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.loginTextWrapper}>
            <Text style={styles.loginShadow}>Login</Text>
            <Text style={styles.loginText}>Login</Text>
          </View>

          <TextInput
            placeholder="Email"
            style={[
              styles.input, {
                color: inputTextColor,
                borderBottomColor: '#d5e0b5',
                fontSize: subtitleFontSize,
              },
            ]}
            placeholderTextColor="#ccc"
            fontFamily="Alice"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />

          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="Senha"
              style={[
                styles.passwordInput, {
                  color: inputTextColor,
                  fontSize: subtitleFontSize,
                },
              ]}
              placeholderTextColor="#ccc"
              secureTextEntry={!passwordVisible}
              value={senha}
              onChangeText={setSenha}
              editable={!loading}
            />

            <TouchableOpacity 
              onPress={() => setPasswordVisible(!passwordVisible)}
              disabled={loading}
            >
              {passwordVisible ? (
                <Eye color={iconColor} size={25} />
              ) : (
                <EyeOff color={iconColor} size={25} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.optionsRow}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? '#cfd8b5' : undefined}
                disabled={loading}
              />
              <Text style={[
                styles.checkboxLabel,
                { color: checkboxLabelColor, fontSize: captionFontSize },]}
              >
                Lembrar de mim
              </Text>
            </View>

            <TouchableOpacity 
              onPress={() => navigation.navigate('EsqueciSenha')}
              disabled={loading}
            >
              <Text style={[
                styles.forgotPassword,
                  { color: forgotPasswordColor, fontSize: captionFontSize },
                ]}
              >
                Esqueceu a senha?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleLoginSimple}
            disabled={loading}
            style={[
              styles.loginButton, {
                paddingHorizontal: buttonPaddingH,
                paddingVertical: buttonPaddingV,
                opacity: loading ? 0.6 : 1,
              },
            ]}
          >
            <Text style={[
              styles.loginTextButton, 
                { fontSize: buttonFontSize }
              ]}
            >
              {loading ? 'Entrando...' : 'Logar'}
            </Text>
          </TouchableOpacity>

          <View style={styles.registerPromptWrapper}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('TipoCadastro')}
              disabled={loading}
            >
              <Text style={[ 
                styles.loginTextButton, {
                  fontSize: subtitleFontSize * 0.85,
                  fontFamily: 'Alice',
                  opacity: loading ? 0.6 : 1,
                },
                ]}
              >
                Não possui uma conta? <Text style={styles.cadastroBold}>Cadastrar</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[ 
            styles.orText, {
              fontFamily: 'Alice',
              color: orTextColor,
              fontSize: captionFontSize},
            ]}
          >
            Ou continue com
          </Text>

          <View style={styles.socialContainer}>
            <TouchableOpacity
              accessible
              accessibilityLabel="Entrar com Google"
              accessibilityRole="button"
              style={[styles.socialButton, { opacity: loading ? 0.6 : 1 }]}
              onPress={() => console.log('Login com Google')}
              disabled={loading}
            >
              <AntDesign name="google" size={dotSize * 4} color="#787876" />
            </TouchableOpacity>

            <TouchableOpacity
              accessible
              accessibilityLabel="Entrar com Apple"
              accessibilityRole="button"
              style={[styles.socialButton, { opacity: loading ? 0.6 : 1 }]}
              onPress={() => console.log('Login com Apple')}
              disabled={loading}
            >
              <FontAwesome name="apple" size={dotSize * 4} color="#787876" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.bottomBlackBar} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outerContainer: { 
    flex: 1 
  },
  header: { 
    alignItems: 'center' 
  },
  welcome: { 
    textAlign: 'center', 
    color: '#000' 
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  loginTextWrapper: { 
    alignSelf: 'center', 
    zIndex: 10,
    marginBottom: 10 
  },
  loginText: {
    fontSize: 36,
    color: '#44615f',
    fontFamily: 'Findel',
    textAlign: 'center',
  },
  loginTextButton: {
    fontSize: 36,
    color: '#fff',
    fontFamily: 'Alice',
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
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingVertical: 8,
    fontFamily: 'Alice',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#a5c3a7',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 8,
    fontFamily: 'Alice',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 5,
    fontFamily: 'Alice',
  },
  forgotPassword: {
    fontFamily: 'Alice',
  },
  loginButton: {
    width: '50%',
    alignSelf: 'center',
    maxWidth: 300,
    backgroundColor: 'transparent',
    borderColor: '#a5c3a7',
    borderWidth: 3,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  registerPromptWrapper: {
    marginBottom: 10,
    alignItems: 'center',
  },
  cadastroBold: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#ff788a',
  },
  orText: {
    textAlign: 'center',
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
  bottomBlackBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: '#000',
  },
});