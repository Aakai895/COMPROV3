import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView,
  TouchableWithoutFeedback, Keyboard, useWindowDimensions, StyleSheet,
  LayoutAnimation, Animated, Platform, } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Eye, EyeOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CadastroFundo from '../../Style/Backgrounds/CadUsuario_Fundo';
import { getResponsiveSizes } from '../../Style/Responsive';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function CadastroUsuario2() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

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
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('Masculino');
  const [email, setEmail] = useState('');
  const [senhaConfirm, setSenhaConfirm] = useState('');
  const [dataNascimento, setDataNascimento] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

const handleProximo = () => {
  if (!nome || !dataNascimento || !email.trim() || !senhaConfirm.trim()) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // Passar dados para a próxima tela
  const dadosTela1 = {
    nome,
    dataNascimento: dataNascimento.toISOString(), // Converter para string
    sexo,
    email,
    senha: senhaConfirm
  };

  navigation.navigate('CadastroUsuario2', { dadosTela1 });
};

  function formatarData(date) {
    if (!date) return '';
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  if (!fontsLoaded) return null;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.wrapper}>
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY: animatedOffset }] }]}>
          <CadastroFundo />
        </Animated.View>

        <TouchableOpacity
          onPress={() => navigation.navigate('TipoCadastro')}
          style={[styles.backButton, { top: insets.top + 10 }]}
        >
          <Image
            source={
              keyboardVisible
                ? require('../../assets/icones/SetaVoltarBranca.png')
                : require('../../assets/icones/SetaVoltar.png')
            }
            style={[
              styles.backIcon,
              keyboardVisible ? { tintColor: undefined } : { tintColor: '#000' },
            ]}
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
                Cadastre-se para começar sua {'\n'} jornada com o COMPRO.
              </Text>
            </>
          )}
        </View>

        <ScrollView contentContainerStyle={[
          styles.scrollContainer, {
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

          <Text style={[styles.label, { color: textColor }]}>
            Nome completo <Text style={{ color: '#ff788a' }}>*</Text>
          </Text>
          <TextInput
            placeholder="Digite aqui..."
            placeholderTextColor={placeholderColor}
            style={[styles.input, { borderColor, color: textColor }]}
            value={nome}
            onChangeText={setNome}
          />

          <View style={styles.row}>
            <View style={[styles.column, { marginRight: 10 }]}> 
              <Text style={[styles.label, { color: textColor }]}>
                Data de Nascimento <Text style={{ color: '#ff788a' }}>*</Text>
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={[styles.input, { borderColor, justifyContent: 'center' }]}
              >
                <Text style={{ color: dataNascimento ? textColor : placeholderColor }}>
                  {dataNascimento ? formatarData(dataNascimento) : '00/00/0000'}
                </Text>
              </TouchableOpacity>

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
            </View>

            <View style={styles.column}>
              <Text style={[styles.label, { color: textColor }]}>
                Sexo <Text style={{ color: '#ff788a' }}>*</Text>
              </Text>
              <View style={[styles.input, { borderColor }]}>
                <Picker
                  selectedValue={sexo}
                  style={[styles.picker, { color: textColor }]}
                  dropdownIconColor={iconColor}
                  onValueChange={(value) => setSexo(value)}
                >
                  <Picker.Item label="Masculino" value="Masculino" />
                  <Picker.Item label="Feminino" value="Feminino" />
                  <Picker.Item label="Outro" value="Outro" />
                </Picker>
              </View>
            </View>
          </View>

          <Text style={[styles.label, { color: textColor }]}>
            Email <Text style={{ color: '#ff788a' }}>*</Text>
          </Text>
          <TextInput
            placeholder="Digite aqui..."
            placeholderTextColor={placeholderColor}
            style={[styles.input, { borderColor, color: textColor }]}
            value={email}
            onChangeText={setEmail}
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
              value={senhaConfirm}
              onChangeText={setSenhaConfirm}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? (
                <Eye color={iconColor} size={25} />
              ) : (
                <EyeOff color={iconColor} size={25} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleProximo}
            style={[styles.loginButton, { paddingHorizontal: buttonPaddingH, paddingVertical: buttonPaddingV }]}
          >
            <Text style={styles.loginTextButton}>Próximo</Text>
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
  header: { 
    alignItems: 'center' 
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
    zIndex: 10 
  },
  loginText: { 
    fontSize: 36, 
    color: '#44615f', 
    fontFamily: 'Findel', 
    textAlign: 'center' 
  },
  usuarioText: { 
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
