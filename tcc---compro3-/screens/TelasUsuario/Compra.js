import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform,
  StatusBar, TouchableOpacity, Image, Dimensions, ScrollView, } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const scale = size => (width / 375) * size;
const verticalScale = size => (height / 812) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function Home() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.navigate('Carrinho')}>
          <Image source={require('../../assets/icones/SetaVoltar.png')} 
            style={styles.imgVoltar} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.headerCenter}>
        <Text style={styles.headerText}>
          Garantia
        </Text>
        <Ionicons name="shield-checkmark-sharp" size={scale(44)} color="#ff788a" />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.box}>
          <View style={styles.row}>
            <FontAwesome6 name="pix" size={scale(32)} color="#00bead" />
            <View style={styles.infoContainer}>
              <Text style={styles.title}>
                Pix
              </Text>
              <Text style={styles.description}>
                Aprovação imediata
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.row}>
            <Image source={require('../../assets/icones/CartaoIcon.png')}
              style={[styles.iconImg, { width: scale(32), height: scale(32) }]}
              resizeMode="contain"
            />
            
            <View style={styles.infoContainer}>
              <Text style={styles.paymentText}>
                Cartão de Crédito
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.row}>
            <FontAwesome name="barcode" size={scale(32)} color="black" />
            <View style={styles.infoContainer}>
              <Text style={styles.title}>
                Boleto Bancário
              </Text>
              <Text style={styles.subDescription}>
                O seu pedido será enviado após a confirmação de pagamento, que poderá levar até 3 dias.
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={[styles.row, styles.bottomRow]}>
            <Image source={require('../../assets/icones/FinanciamentoIcon.png')}
              style={[styles.iconImg, { width: scale(32), height: scale(32) }]}
              resizeMode="contain"
            />

            <View style={styles.infoContainer}>
              <Text style={styles.title}>
                Financiamento com o Banco
              </Text>
              <Text style={styles.subDescriptionWide}>
                Entre em contato com seu Banco para mais informações
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 25,
    backgroundColor: '#fff',
  },
  btnVoltar: {
    marginRight: 10,
  },
  imgVoltar: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: 'Alice-Regular',
    fontSize: moderateScale(35),
    fontWeight: 'bold',
    marginRight: scale(8),
    textAlign: 'center',
  },
  box: {
    marginHorizontal: scale(23),
    borderWidth: 1,
    borderColor: '#bfbaba',
    borderRadius: scale(15),
    padding: scale(15),
    marginTop: verticalScale(30),
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: verticalScale(10),
  },
  bottomRow: {
    marginBottom: verticalScale(10),
  },
  infoContainer: {
    flex: 1,
    marginLeft: scale(10),
    marginRight: scale(10),
  },
  title: {
    fontFamily: 'Alice-Regular',
    fontSize: moderateScale(20),
    color: '#3b1b0d',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  description: {
    fontFamily: 'Alice-Regular',
    fontSize: moderateScale(18),
    color: '#3b1b0d',
    marginTop: verticalScale(5),
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  subDescription: {
    fontFamily: 'Alice-Regular',
    color: '#3b1b0d',
    fontSize: moderateScale(16),
    marginTop: verticalScale(5),
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  subDescriptionWide: {
    fontFamily: 'Alice-Regular',
    color: '#3b1b0d',
    fontSize: moderateScale(16),
    marginTop: verticalScale(5),
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  paymentText: {
    fontSize: moderateScale(20),
    fontFamily: 'Alice-Regular',
    color: '#3b1b0d',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#bfbaba',
    width: '95%',
    marginTop: verticalScale(15),
    marginBottom: verticalScale(15),
    alignSelf: 'center',
  },
});
