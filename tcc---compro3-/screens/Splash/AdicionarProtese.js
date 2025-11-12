import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import FundoAddProtese from '../../Style/Backgrounds/AdicioProtese_Fundo';

const { width } = Dimensions.get('window');

export default function AddProtese({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fundoContainer}>
        <FundoAddProtese />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('TelasUsuario')}
          >
            <Image
              source={require('../../assets/icones/SetaVoltar.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>
              Insira as Informações {'\n'} da sua prótese
            </Text>

            {/* 👇 Imagem responsiva e maior */}
            <Image
              source={require('../../assets/Elementos_Complementares/MeninosFelizes.PNG')}
              style={styles.meninosImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
    paddingTop: 35,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
    marginBottom: 15,
  },
  meninosImage: {
    width: width * 0.8, 
    height: width * 0.8, 
  },
  fundoContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  scrollContent: {
    flexGrow: 1,
    zIndex: 1,
  },
});
