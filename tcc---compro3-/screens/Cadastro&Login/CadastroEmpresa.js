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

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [empresa, setEmpresa] = useState('');
  const [cnpj, setCnpj] = useState('');
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
  if (!empresa || !cnpj || !telefone1 || !estado || !cidade || !endereco) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  // Passar dados para a próxima tela
  const dadosTela1 = {
    empresa,
    cnpj,
    telefone1,
    telefone2,
    estado,
    cidade,
    endereco
  };

  navigation.navigate('CadastroEmpresa2', { dadosTela1 });
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

        <View style={{ alignItems: 'center', marginTop: height * 0.08 }}>
          {!keyboardVisible && (
            <>
              <Image
                source={require('../../assets/Logo.png')}
                style={{ width: logoWidth, height: logoHeight, resizeMode: 'contain' }}
              />
              <Text style={styles.gratidao}>
                Somos imensamente gratos por {'\n'} contar com sua clínica nesta missão {'\n'}
                de transformar vidas.
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
            <Text style={styles.empresaText}>Empresa</Text>
          </View>

          <Text style={[styles.label, { color: textColor }]}>
            Nome da Empresa <Text style={{ color: '#ff788a' }}>*</Text>
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

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={[styles.label, { color: textColor }]}>
                Telefone 1 <Text style={{ color: '#ff788a' }}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, { borderColor, color: textColor }]}
                placeholder="(11) 12345-6789"
                placeholderTextColor={placeholderColor}
                value={telefone1}
                onChangeText={setTelefone1}
                keyboardType="phone-pad"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: textColor }]}>
                Telefone 2 (se houver)
              </Text>
              <TextInput
                style={[styles.input, { borderColor, color: textColor }]}
                placeholder="(11) 12345-6789"
                placeholderTextColor={placeholderColor}
                value={telefone2}
                onChangeText={setTelefone2}
                keyboardType="phone-pad"
              />
            </View>
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
            style={[styles.input, { marginBottom: 25, borderColor, color: textColor }]}
            placeholder="Ex: Andrade, 200"
            placeholderTextColor={placeholderColor}
            value={endereco}
            onChangeText={setEndereco}
          />

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
