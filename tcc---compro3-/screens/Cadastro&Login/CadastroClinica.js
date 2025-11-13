import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView,
 TouchableWithoutFeedback, Keyboard, useWindowDimensions, StyleSheet,
  LayoutAnimation, Animated, Platform,} from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CadastroFundo from '../../Style/Backgrounds/CadEmpresa_Fundo';
import { getResponsiveSizes } from '../../Style/Responsive';
import { Picker } from '@react-native-picker/picker';

export default function CadastroClinicaScreen() {
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

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [empresa, setEmpresa] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [afe, setAfe] = useState('');
  const [telefone1, setTelefone1] = useState('');
  const [telefone2, setTelefone2] = useState('');
  const [estado, setEstado] = useState('SP');
  const [cidade, setCidade] = useState('SP');
  const [endereco, setEndereco] = useState('');

  const animatedOffset = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    Alice: require('../../fonts/Alice-Regular.ttf'),
    Findel: require('../../fonts/Findel-Display-Regular.otf'),
  });

  const estadosECidades = {
    SP: ['Osasco', 'Taboão da Serra', 'Embu das Artes', 'Cotia'],
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
    if (!empresa || !cnpj || !telefone1 || !estado || !cidade || !endereco || !afe) {
      alert('Preencha todos os campos obrigatórios (asterisco rosa).');
      return;
    }

    // Passar dados para a próxima tela
    const dadosTela1 = {
      empresa,
      cnpj,
      afe,
      telefone1,
      telefone2,
      estado,
      cidade,
      endereco
    };

    navigation.navigate('CadastroClinica2', { dadosTela1 });
  };

  if (!fontsLoaded) return null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.wrapper}>
        {/* ... (resto do código permanece igual) ... */}
        
        <TouchableOpacity
          onPress={handleProximo}
          style={[ styles.loginButton, {
                paddingHorizontal: buttonPaddingH,
                paddingVertical: buttonPaddingV,
              },
            ]}
        >
          <Text style={styles.loginTextButton}>Próximo</Text>
        </TouchableOpacity>

        {/* ... (resto do código permanece igual) ... */}
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
  empresaText: {
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
    alignItems: 'center',
    gap: 20,
  },
  socialButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    flex: 1,
  },
});
