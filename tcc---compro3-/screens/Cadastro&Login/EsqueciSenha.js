import React, { useState, useRef, alert} from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput,
  Image, ScrollView, Platform, KeyboardAvoidingView, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function App() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Alice: require('../../fonts/Alice-Regular.ttf'),
  });

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [codeInputs, setCodeInputs] = useState(['', '', '', '', '']);
  const [errorEmail, setErrorEmail] = useState('');
  const inputsRef = useRef([]);
  const [novaSenhaVisible, setNovaSenhaVisible] = useState(false);
  const [senhaVisible, setSenhaVisible] = useState(false);

  const steps = {
    1: {
      message: 'Não se preocupe, \n vamos te mandar as instruções',
      buttonLabel: 'Resetar Senha',
    },
    2: {
      message:
        'Verifique o código enviado no seu Email, insira o código para confirmar que é você.',
      buttonLabel: 'Verificar',
    },
    3: {
      message:
        'Identidade confirmada! Agora, escolha uma \n nova senha para sua conta.',
      buttonLabel: 'Confirmar',
    },
  };

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const handleNext = () => {
    if (step === 1) {
      if (!email.trim()) {
        setErrorEmail('Por favor, insira um e-mail');
        return;
      }
      if (!isValidEmail(email.trim())) {
        setErrorEmail('Formato de e-mail inválido');
        return;
      }
      setErrorEmail('');
      setStep(step + 1);
    } 
    else if (step === 2) {
      const allFilled = codeInputs.every((input) => input.trim() !== '');
      if (!allFilled) {
        Alert.alert('Código incompleto', 'Por favor, preencha todos os campos do código.');
        return;
      }
      setStep(step + 1);
    } 
    else if (step === 3) {
      if (!novaSenha.trim() || !senha.trim()) {
        Alert.alert('Campos vazios', 'Por favor, preencha todos os campos de senha.');
        return;
      }
      if (novaSenha !== senha) {
        Alert.alert('Erro', 'As senhas não coincidem.');
        return;
      }

      Alert.alert(
        'Sucesso!',
        'Sua senha foi atualizada com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ],
        { cancelable: false }
      );
    }
  };

  const handleCodeChange = (text, index) => {
    if (/^\d?$/.test(text)) {
      const newCodeInputs = [...codeInputs];
      newCodeInputs[index] = text;
      setCodeInputs(newCodeInputs);

      if (text && index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (
      nativeEvent.key === 'Backspace' &&
      codeInputs[index] === '' &&
      index > 0
    ) {
      inputsRef.current[index - 1].focus();
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <LinearGradient
          colors={['#ffffff', '#f2f4f7', '#c8cdd8', '#6e7483', '#3f4452']}
          style={{ flex: 1 }}
        >
          {step > 1 && (
            <TouchableOpacity
              style={styles.backArrow}
              onPress={() => setStep(step - 1)}
            >
              <Image
                source={require('../../assets/icones/SetaVoltar.png')}
                style={styles.backArrowImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.container}>
                <Image
                  source={require('../../assets/icones/Cadeado.jpg')}
                  style={styles.cadeado}
                />
                <Text style={styles.titleGreen}>Esqueceu</Text>
                <Text style={styles.titleBlack}>Sua senha?</Text>
                <Text style={styles.textInfo}>{steps[step].message}</Text>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              {step === 1 && (
                <View style={styles.inputGroup}>
                  <TextInput
                    placeholder="Insira seu E-mail aqui..."
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errorEmail ? (
                    <Text style={styles.errorText}>{errorEmail}</Text>
                  ) : null}
                </View>
              )}

              {step === 2 && (
                <View style={styles.codeContainer}>
                  {codeInputs.map((code, index) => (
                    <View key={index} style={styles.codeBox}>
                      <TextInput
                        ref={(el) => (inputsRef.current[index] = el)}
                        style={styles.codeInputInside}
                        keyboardType="numeric"
                        maxLength={2}
                        placeholder={index < 2 ? (index + 1).toString() : '-'}
                        placeholderTextColor="#666"
                        textAlign="center"
                        value={codeInputs[index]}
                        onChangeText={(text) => handleCodeChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                      />
                    </View>
                  ))}
                </View>
              )}

              {step === 3 && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Insira sua nova senha
                    </Text>
                    <View style={styles.passwordInputContainer}>
                      <TextInput
                        placeholder="Insira aqui..."
                        style={[styles.input, { flex: 1 }]}
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                        placeholderTextColor="#999"
                        secureTextEntry={!novaSenhaVisible}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          setNovaSenhaVisible(!novaSenhaVisible)
                        }
                        style={styles.eyeIcon}
                      >
                        <Ionicons
                          name={novaSenhaVisible ? 'eye' : 'eye-off'}
                          size={25}
                          color="#fff"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Confirmar senha
                    </Text>
                    <View style={styles.passwordInputContainer}>
                      <TextInput
                        placeholder="Insira aqui..."
                        style={[styles.input, { flex: 1 }]}
                        value={senha}
                        onChangeText={setSenha}
                        placeholderTextColor="#999"
                        secureTextEntry={!senhaVisible}
                      />
                      <TouchableOpacity
                        onPress={() => setSenhaVisible(!senhaVisible)}
                        style={styles.eyeIcon}
                      >
                        <Ionicons
                          name={senhaVisible ? 'eye' : 'eye-off'}
                          size={25}
                          color="#fff"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}

              <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>
                  {steps[step].buttonLabel}
                </Text>
              </TouchableOpacity>

              {step === 2 && (
                <TouchableOpacity
                  style={styles.secondaryLink}
                  onPress={() => setStep(1)}
                >
                  <Text style={styles.secondaryLinkText}>
                    <Text style={{ color: '#fff'}}>
                      Não recebeu o código ainda?
                    </Text>
                    <Text style={{ color: '#ff788a'}}> 
                      Reenvie o código.</Text>
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.loginText}>
                  Voltar ao Login
                </Text>
                <Ionicons name="arrow-down" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  cadeado: {
    width: 70,
    height: 70,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  titleGreen: {
    fontSize: 40,
    fontWeight: '700',
    color: '#a4b8a4',
    textAlign: 'center',
  },
  titleBlack: {
    fontSize: 40,
    fontWeight: '900',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  textInfo: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
    width: '100%',
    lineHeight: 18,
    fontFamily: 'Alice',
  },
  footer: {
    backgroundColor: '#000',
    padding: 40,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#fff',
    marginBottom: 6,
    fontSize: 16,
    fontFamily: 'Alice',
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontFamily: 'Alice',
    fontSize: 16,
    height: 50,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  codeBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    flex: 1,               
    aspectRatio: 0.75,   
    marginHorizontal: 4, 
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 70,      
  },
  codeInputInside: {
    color: '#fff',
    fontSize: 24,
    width: '100%',
    height: '100%',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#a4b8a4',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    fontFamily: 'Alice',
  },
  secondaryLink: {
    alignItems: 'center',
    marginBottom: 20,
  },
  secondaryLinkText: {
    color: '#a4b8a4',
    fontSize: 14,
    fontFamily: 'Alice',
    textAlign: 'center',
  },
  loginLink: {
    marginTop: 10,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Alice',
  },
  errorText: {
    color: 'red',
    marginTop: 6,
    fontSize: 14,
    fontFamily: 'Alice',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    paddingHorizontal: 8,
  },
  backArrow: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    zIndex: 1000,
    padding: 10,
  },
  backArrowImage: {
    width: 24,
    height: 24,
    tintColor: '#000',
  },
});
