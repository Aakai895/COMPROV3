// TelaInicial.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image,
  TouchableOpacity, ScrollView,} from 'react-native';
import FundoEmocoes from '../../Style/Backgrounds/Emocoes_Fundo';

export default function TelaInicial({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <FundoEmocoes />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image source={require('../../assets/Elementos_Complementares/EmocoesRostos.png')}
          style={styles.rostos}
        />

        <Text style={styles.perguntaTexto}>
          Como você está se sentindo {'\n'}hoje?
        </Text>

        <View style={styles.cardsLinha}>
          <TouchableOpacity style={[styles.cardfelicidade, styles.cardComMargem]}
            onPress={() => navigation.navigate('Humores', { emocao: 'feliz' })}
          >
            <Text style={styles.textoFeliz}>
              Feliz
            </Text>
            
            <Image source={require('../../assets/Elementos_Complementares/Feliz.png')}
              style={styles.fotoemocao}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.cardtristeza}
            onPress={() => navigation.navigate('Humores', { emocao: 'triste' })}
          >
            <Text style={styles.textoTriste}>
              Triste
            </Text>
            <Image source={require('../../assets/Elementos_Complementares/Triste.png')}
              style={styles.fotoemocao}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardsLinha}>
          <TouchableOpacity style={[styles.cardneutro, styles.cardComMargem]}
            onPress={() => navigation.navigate('Humores', { emocao: 'neutro' })}
          >
            <Text style={styles.textoNeutro}>
              Neutro
            </Text>
            <Image source={require('../../assets/Elementos_Complementares/Neutro.png')}
              style={styles.fotoemocao}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.cardmalestar}
            onPress={() => navigation.navigate('Humores', { emocao: 'malestar' })}
          >
            <Text style={styles.textoMalEstar}>
              Mal-Estar
            </Text>
            <Image source={require('../../assets/Elementos_Complementares/MalEstar.png')}
              style={styles.fotoemocao}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_SIZE = 135;
const CARD_SPACING = 15;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 20,
  },
  rostos: {
    height: 180,
    width: 330,
    marginBottom: 10,
  },
  perguntaTexto: {
    fontSize: 19,
    width: '80%',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardsLinha: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 2 * CARD_SIZE + CARD_SPACING,
    marginTop: 15,
  },
  cardComMargem: {
    marginRight: CARD_SPACING,
  },
  cardfelicidade: {
    backgroundColor: '#f8f4c4',
    justifyContent: 'center',
    alignItems: 'center',
    height: CARD_SIZE,
    width: CARD_SIZE,
    borderRadius: 35,
    elevation: 6,
  },
  cardtristeza: {
    backgroundColor: '#a1b1bc',
    justifyContent: 'center',
    alignItems: 'center',
    height: CARD_SIZE,
    width: CARD_SIZE,
    borderRadius: 35,
    elevation: 6,
  },
  cardneutro: {
    backgroundColor: '#d9d9d9',
    justifyContent: 'center',
    alignItems: 'center',
    height: CARD_SIZE,
    width: CARD_SIZE,
    borderRadius: 35,
    elevation: 6,
  },
  cardmalestar: {
    backgroundColor: '#a24c58',
    justifyContent: 'center',
    alignItems: 'center',
    height: CARD_SIZE,
    width: CARD_SIZE,
    borderRadius: 35,
    elevation: 6,
  },
  fotoemocao: {
    width: 77,
    height: 93,
  },
  textoFeliz: { 
    color: '#ffa600', 
    fontSize: 18 
  },
  textoTriste: { 
    color: '#004472', 
    fontSize: 18 
  },
  textoNeutro: { 
    color: '#000000', 
    fontSize: 18 
  },
  textoMalEstar: { 
    color: '#54000d', 
    fontSize: 18 
  },
});
