import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ScrollView, Image,} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Octicons from '@expo/vector-icons/Octicons';

export default function Configuracoes() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('TelasUsuario', { screen: 'Perfil' })}
        >
          <Image source={require('../../assets/icones/SetaVoltar.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Configurações
        </Text>
      </View>

      <View style={styles.contentArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentWrapper}>
            <TouchableOpacity style={styles.card}>
              <Image source={require('../../assets/icones/PagamentosIcon.png')}
                style={styles.icon2}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>
                Pagamentos
              </Text>
              <Octicons name="chevron-right" size={40} color="#000" style={styles.chevron} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Image source={require('../../assets/icones/perfil2Icon.webp')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>
                Configurações de notificação
              </Text>
              <Octicons name="chevron-right" size={40} color="#000" style={styles.chevron} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Image source={require('../../assets/icones/GerenSenhas.webp')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>Gerenciador de senha</Text>
              <Octicons name="chevron-right" size={40} color="#000" style={styles.chevron} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Image source={require('../../assets/icones/DeletarIcon.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>Deletar sua conta</Text>
              <Octicons name="chevron-right" size={40} color="#000" style={styles.chevron} />
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
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 26,
    height: 26,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 26,
  },
  contentArea: {
    flex: 1,
  },
  chevron: {
    marginLeft: 'auto',
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
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  icon: {
    width: 26,
    height: 26,
    marginRight: 10,
  },
   icon2: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  cardText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
});
