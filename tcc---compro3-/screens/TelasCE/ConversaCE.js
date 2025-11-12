import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TextInput,
  TouchableOpacity,  SafeAreaView, ScrollView, Platform, KeyboardAvoidingView,
  Animated, Keyboard, TouchableWithoutFeedback, LayoutAnimation,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const formatDateLabel = (dateString) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const [year, month, day] = dateString.split('-');
  const messageDate = new Date(year, month - 1, day);

  const isToday =
    messageDate.getDate() === today.getDate() &&
    messageDate.getMonth() === today.getMonth() &&
    messageDate.getFullYear() === today.getFullYear();

  const isYesterday =
    messageDate.getDate() === yesterday.getDate() &&
    messageDate.getMonth() === yesterday.getMonth() &&
    messageDate.getFullYear() === yesterday.getFullYear();

  if (isToday) return 'Hoje';
  if (isYesterday) return 'Ontem';

  return `${day}/${month}/${year}`;
};

export default function Home({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const animatedOffset = useRef(new Animated.Value(0)).current;

  const STORAGE_KEY = '@mensagens_salvas';

  useEffect(() => {
    const carregarMensagens = async () => {
      try {
        const mensagensSalvas = await AsyncStorage.getItem(STORAGE_KEY);
        if (mensagensSalvas !== null) {
          setMessages(JSON.parse(mensagensSalvas));
        }
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
      }
    };

    carregarMensagens();
  }, []);

  useEffect(() => {
    const salvarMensagens = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error('Erro ao salvar mensagens:', error);
      }
    };

    salvarMensagens();
  }, [messages]);

  useEffect(() => {
    const onShow = (e) => {
      const height = e.endCoordinates?.height || 0;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Animated.timing(animatedOffset, {
        toValue: -height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    };

    const onHide = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Animated.timing(animatedOffset, {
        toValue: 0,
        duration: 250,
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

  const sendMessage = () => {
    if (messageText.trim() !== '') {
      const currentTime = new Date();
      const hours = currentTime.getHours().toString().padStart(2, '0');
      const minutes = currentTime.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;
      const date = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')}`;

      setMessages([
        ...messages,
        {
          text: messageText,
          sender: 'user',
          time: formattedTime,
          date: date,
        },
      ]);
      setMessageText('');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.blue}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.navigate('TelasCE')}>
              <Image
                source={require('../../assets/icones/SetaVoltar.png')}
                style={styles.backIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View style={styles.leftContainer}>
              <Image
                source={require('../../assets/Plano_Fundo/ExploreApp.jpg.png')}
                style={styles.iconeconversa}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  Juliana Pães
                </Text>
                <Text style={styles.userStatus}>
                  Offline
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('')}>
              <Image
                source={require('../../assets/icones/telefone.png')}
                style={styles.cartIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.white}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {Object.entries(
            messages.reduce((groups, message) => {
              const date = message.date;
              if (!groups[date]) groups[date] = [];
              groups[date].push(message);
              return groups;
            }, {})
          ).map(([date, msgs]) => (
            <View key={date}>
              <Text style={styles.hojeText}>{formatDateLabel(date)}</Text>
              {msgs.map((message, index) => (
                <View key={index} style={
                  message.sender === 'user'
                    ? styles.mensagemusuario
                    : styles.mensagemclinica
                  }
                >
                  <Text style={
                    message.sender === 'user'
                      ? styles.mensagemUsuarioTexto
                      : styles.mensagemTexto
                    }
                  >
                    {message.text}
                  </Text>

                  <Text style={
                    message.sender === 'user' 
                      ? styles.horarioUsuario 
                      : styles.horario
                    }
                  >
                    {message.time}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>

        <Animated.View style={[styles.suamensagem, { transform: [{ translateY: animatedOffset }] }]}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.formtext}
              placeholder="Digite sua mensagem aqui..."
              placeholderTextColor="#000000"
              value={messageText}
              onChangeText={setMessageText}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <FontAwesome name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
    marginRight: 10,
  },
  cartButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  cartIcon: {
    width: 28,
    height: 28,
  },
  blue: {
    backgroundColor: '#a1b1bc',
    padding: 20,
    paddingBottom: 30,
  },
  headerContent: {
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconeconversa: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    color: 'white',
  },
  userStatus: {
    fontSize: 14,
    color: 'white',
    marginTop: 4,
  },
  white: {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  hojeText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  mensagemclinica: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: 'white',
    marginTop: 15,
    marginLeft: 15,
    maxWidth: '50%',
    width: 'auto',
  },
  mensagemusuario: {
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#47667b',
    marginTop: 5,
    marginLeft: 'auto',
    marginRight: 15,
    maxWidth: '50%',
    width: 'auto',
  },
  mensagemTexto: {
    fontSize: 14,
    color: '#000',
  },
  mensagemUsuarioTexto: {
    fontSize: 14,
    color: 'white',
  },
  horario: {
    fontSize: 10,
    marginLeft: 'auto',
    color: '#737373',
    marginRight: 5,
    marginTop: 5,
  },
  horarioUsuario: {
    fontSize: 10,
    marginLeft: 'auto',
    color: 'white',
    marginRight: 5,
    marginTop: 5,
  },
  suamensagem: {
    backgroundColor: 'white',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 10,
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
    height: 62,
  },
  formtext: {
    padding: 14,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#d9d9d9',
    backgroundColor: 'white',
    fontSize: 16,
    paddingRight: 50,
    minHeight: 50,
    maxHeight: 120,
  },
  sendButton: {
    position: 'absolute',
    right: 15,
    bottom: 12,
    backgroundColor: '#47667b',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
