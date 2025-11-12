import React from 'react';
import { View, Text, StyleSheet, Image,
  TouchableOpacity, SafeAreaView, } from 'react-native';
import FundoFAQChat from '../../Style/Backgrounds/FAQ&Chat_Fundo';

export default function Chat({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <FundoFAQChat />
      <TouchableOpacity style={styles.chatview}
        onPress={() => navigation.navigate('Conversa')}
      >
        <Image source={require('../../assets/Plano_Fundo/ExploreApp.jpg.png')}
          style={styles.iconeuser}
        />

        <View style={styles.messageContent}>
          <Text style={styles.userName}>Clínica Maia</Text>
          <Text style={styles.messagePreview}>
            Boa tarde! Tenho uma dúvida rela...
          </Text>
        </View>

        <Text style={styles.time}>16:30</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
    paddingTop: 20,
  },
  chatview: {
    borderWidth: 2,
    borderColor: '#d9d9d9',
    padding: 16,
    width: '90%',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
  },
  iconeuser: {
    height: 60, 
    width: 60,
    borderRadius: 30,
  },
  messageContent: {
    flexDirection: 'column',
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontFamily: 'Alice-regular',
    fontSize: 18, 
    color: '#1c404b',
    fontWeight: 'bold',
  },
  messagePreview: {
    fontFamily: 'Alice-regular',
    fontSize: 14,
    marginTop: 4,
    color: '#333',
  },
  time: {
    fontFamily: 'Alice-regular',
    color: '#ff788a',
    fontSize: 18,
    marginLeft: 8,
  },
});
