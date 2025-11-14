import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, Keyboard, useWindowDimensions, StyleSheet, LayoutAnimation, Animated, Platform, Alert } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import CadastroFundo from '../../Style/Backgrounds/CadEmpresa_Fundo';
import { getResponsiveSizes } from '../../Style/Responsive';

export default function CadastroTipoScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { dotSize, buttonPaddingH, buttonPaddingV, logoWidth, logoHeight } = getResponsiveSizes(width, height);

  const [tipoUsuario, setTipoUsuario] = useState('paciente');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const animatedOffset = useRef(new Animated.Value(0)).current;
  
  const [fontsLoaded, fontError] = useFonts({
    Alice: require('../../fonts/Alice-Regular.ttf'),
    Findel: require('../../fonts/Findel-Display-Regular.otf'),
  });

  // Verificar se as fontes carregaram ou se houve erro
  const fontsReady = fontsLoaded || fontError;

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

  const handleProximo = () => {
    if (!nome.trim() || !email.trim()) {
      Alert.alert('Atenção', 'Preencha nome e email para continuar.');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Atenção', 'Por favor, insira um email válido.');
      return;
    }

    const dadosTela1 = {
      tipoUsuario,
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      telefone: telefone.trim()
    };

    console.log('Navegando para Cadastro2 com dados:', dadosTela1);
    navigation.navigate('Cadastrouni2', { dadosTela1 });
  };

  // Se as fontes não carregaram ainda, mostrar tela vazia
  if (!fontsReady) {
    return (
      <View style={styles.wrapper}>
        <CadastroFundo />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.wrapper}>
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY: animatedOffset }] }]}>
          <CadastroFundo />
        </Animated.View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { top: insets.top + 10 }]}
          activeOpacity={0.7}
        >
          <Image
            source={keyboardVisible ? require('../../assets/icones/SetaVoltarBranca.png') : require('../../assets/icones/SetaVoltar.png')}
            style={[
              styles.backIcon, 
              keyboardVisible ? undefined : { tintColor: '#000' }
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={{ 
          alignItems: 'center', 
          marginTop: keyboardVisible ? 10 : height * 0.08 
        }}>
          {!keyboardVisible && (
            <>
              <Image
                source={require('../../assets/Logo.png')}
                style={{ 
                  width: logoWidth, 
                  height: logoHeight, 
                  resizeMode: 'contain' 
                }}
              />
              <Text style={styles.gratidao}>
                Vamos começar seu cadastro!{'\n'}Escolha o tipo de conta.
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
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerWrapper}>
            <Text style={styles.tituloShadow}>Cadastro</Text>
            <Text style={styles.tituloText}>Cadastro</Text>
            <Text style={styles.tipoText}>Informações Básicas</Text>
          </View>

          <Text style={[styles.label, { color: textColor }]}>
            Tipo de Conta <Text style={{ color: '#ff788a' }}>*</Text>
          </Text>
          <View style={[styles.input, { borderColor }]}>
            <Picker
              selectedValue={tipoUsuario}
              style={[styles.picker, { color: textColor }]}
              dropdownIconColor={iconColor}
              onValueChange={(itemValue) => setTipoUsuario(itemValue)}
              mode="dropdown"
            >
              <Picker.Item label="Paciente" value="paciente" />
              <Picker.Item label="Empresa" value="empresa" />
              <Picker.Item label="Clínica" value="clinica" />
            </Picker>
          </View>

          <Text style={[styles.label, { color: textColor }]}>
            Nome Completo <Text style={{ color: '#ff788a' }}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, { borderColor, color: textColor }]}
            placeholder="Digite seu nome completo..."
            placeholderTextColor={placeholderColor}
            value={nome}
            onChangeText={setNome}
            returnKeyType="next"
            autoCapitalize="words"
          />

          <Text style={[styles.label, { color: textColor }]}>
            Email <Text style={{ color: '#ff788a' }}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, { borderColor, color: textColor }]}
            placeholder="seu@email.com"
            placeholderTextColor={placeholderColor}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            autoComplete="email"
          />

          <Text style={[styles.label, { color: textColor }]}>Telefone</Text>
          <TextInput
            style={[styles.input, { marginBottom: 25, borderColor, color: textColor }]}
            placeholder="(11) 12345-6789"
            placeholderTextColor={placeholderColor}
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
            returnKeyType="done"
          />

          <TouchableOpacity
            onPress={handleProximo}
            style={[
              styles.loginButton, 
              { 
                paddingHorizontal: buttonPaddingH, 
                paddingVertical: buttonPaddingV,
              }
            ]}
            activeOpacity={0.7}
          >
            <Text style={styles.loginTextButton}>Próximo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.registerText}>
              Já possui uma conta? <Text style={styles.cadastroBold}>Logar</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.orText}>Ou continue com</Text>

          <View style={styles.socialContainer}>
            <TouchableOpacity 
              style={styles.socialButton}
              activeOpacity={0.7}
            >
              <AntDesign name="google" size={dotSize * 4} color="#787876" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.socialButton}
              activeOpacity={0.7}
            >
              <FontAwesome name="apple" size={dotSize * 4} color="#787876" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const INPUT_HEIGHT = 45;

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
  gratidao: {
    textAlign: 'center',
    color: '#000',
    fontFamily: 'Alice',
    marginVertical: 10,
    fontSize: 16,
    lineHeight: 22,
  },
  scrollContainer: { 
    paddingHorizontal: 30 
  },
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
    marginTop: 5,
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
    backgroundColor: 'rgba(165, 195, 167, 0.3)',
  },
  loginTextButton: {
    color: '#fff',
    fontFamily: 'Alice',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Alice',
    marginBottom: 10,
    fontSize: 14,
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
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  socialButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});