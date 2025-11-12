import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, Image,
  TouchableOpacity, ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function Suporte() {
  const navigation = useNavigation();
  const [isExpanded, setIsExpanded] = useState(false); 

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton}
          onPress={() => navigation.navigate('TelasUsuario')}
        >
          <Image source={require('../../assets/icones/SetaVoltar.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Suporte</Text>
      </View>

      <View style={styles.contentArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentWrapper}>

            <TouchableOpacity style={styles.card} onPress={toggleExpand}>
              <Image source={require('../../assets/icones/AtendCliente.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>Atendimento ao cliente</Text>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={30}
                color="#444"
              />
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.subOptions}>
                <TouchableOpacity style={styles.subOption}>
                  <Ionicons name="call" size={20} color="#444" style={styles.subIcon} />
                  <Text style={styles.subText}>Atendimento telefônico</Text>
                </TouchableOpacity>

                <View style={styles.separator} />

                <TouchableOpacity style={styles.subOption}>
                  <Ionicons name="chatbubbles" size={20} color="#444" style={styles.subIcon} />
                  <Text style={styles.subText}>Atendimento via chat online</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.card}>
              <Image source={require('../../assets/icones/ZapIcon.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>Whatsapp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Image source={require('../../assets/icones/InstaIcon.webp')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>Instagram</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Image source={require('../../assets/icones/FaceIcon.jpg')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>Facebook</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
    marginLeft: 0,
    marginRight: 50,
  },
  contentArea: {
    flex: 1,
  },
  contentWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
  cardText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  subOptions: {
    backgroundColor: '#fff',
    marginTop: -8,
    marginBottom: 12,
    paddingLeft: 45,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  subOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  subIcon: {
    marginRight: 10,
  },
  subText: {
    fontSize: 15,
    color: '#444',
  },
});
