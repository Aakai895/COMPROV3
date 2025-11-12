import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, KeyboardAvoidingView, Platform,
  Animated, Keyboard, TouchableWithoutFeedback, LayoutAnimation, } from 'react-native';

export default function CancelarConsulta({ navigation }) {
  const [selectedValue, setSelectedValue] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const animatedOffset = useRef(new Animated.Value(0)).current;

  const motivos = [
    'Compromissos inesperados',
    'Não posso comparecer nesse horário',
    'Já fui atendido por outro profissional',
    'Problemas com transporte ou deslocação',
    'Mudança de planos',
    'Condições climáticas',
    'Desisti de realizar o atendimento',
    'Outro',
  ];

  useEffect(() => {
    const onShow = (e) => {
      const height = e.endCoordinates?.height || 0;
      setKeyboardHeight(height);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Animated.spring(animatedOffset, {
        toValue: -height * 0.05,
        useNativeDriver: true,
      }).start();
    };

    const onHide = () => {
      setKeyboardHeight(0);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Animated.spring(animatedOffset, {
        toValue: 0,
        useNativeDriver: true,
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          <Animated.View style={{ flex: 1, transform: [{ translateY: animatedOffset }] }}>
            <ScrollView
              contentContainerStyle={[styles.scrollContainer, { flexGrow: 1 }]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.contentWrapper}>
                <Text style={styles.tituloPrincipal}>Cancelar Consulta</Text>

                <Text style={styles.headerText}>
                  Por favor selecione o motivo do cancelamento
                </Text>

                {motivos.map((motivo, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.radioRow}
                    onPress={() => setSelectedValue(motivo)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                        styles.radioCircle,
                        { borderColor: selectedValue === motivo ? '#47667b' : '#999' },
                      ]}
                    >
                      {selectedValue === motivo && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.radioText}>{motivo}</Text>
                  </TouchableOpacity>
                ))}

                <View style={styles.separator} />

                <Text style={styles.outroLabel}>Outro</Text>

                <TextInput
                  style={styles.formtext}
                  placeholder="Escreva seu motivo aqui..."
                  placeholderTextColor="#000000"
                  multiline
                />
              </View>
            </ScrollView>
          </Animated.View>

          <View style={[
            styles.footerContainer, {
              paddingBottom: keyboardHeight ? keyboardHeight * 1.1 : 30}]}
            >
            <View style={styles.footerContent}>
              <TouchableOpacity style={styles.botaoamarelo}
                onPress={() => navigation.navigate('MinhasConsultas')}
              >
                <Text style={styles.botaoTexto}>
                  Concluir
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('MinhasConsultas')}>
                <Text style={styles.cancelText}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 12,
  },
  scrollContainer: {
    paddingBottom: 10,
  },
  contentWrapper: {
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  tituloPrincipal: {
    fontFamily: 'Alice-Regular',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontFamily: 'Alice-Regular',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  radioText: {
    fontFamily: 'Alice-Regular',
    fontSize: 18,
    marginLeft: 12,
    color: '#000',
  },
  radioCircle: {
    height: 28,
    width: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: '#47667b',
  },
  separator: {
    height: 2,
    backgroundColor: '#d9d9d9',
    marginVertical: 30,
  },
  outroLabel: {
    fontFamily: 'Alice-Regular',
    fontSize: 20,
    marginBottom: 8,
  },
  formtext: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d9d9d9',
    borderRadius: 15,
    padding: 15,
    fontSize: 18,
    height: 155,
    marginBottom: 25,
    textAlignVertical: 'top',
  },
  footerContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#d9d9d9',
    paddingVertical: 20,
    width: '100%',
  },
  footerContent: {
    paddingHorizontal: 30,
  },
  botaoamarelo: {
    backgroundColor: '#f8f4c4',
    borderWidth: 1,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  botaoTexto: {
    fontSize: 20,
    color: '#000',
  },
  cancelText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
