import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

export default function Bem_Vindo1() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    Alice: require('../../fonts/Alice-Regular.ttf'),
    Findel1: require('../../fonts/Findel-Display-Regular.otf'),
  });

  if (!fontsLoaded) return null;

  const handleContinue = () => {
    navigation.navigate('TelasUsuario', {screen:'Consultas'});
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handleContinue} 
      activeOpacity={0.8}
    >
      <View style={{ flex: 1, pointerEvents: 'box-none' }}>
        <View style={styles.imageWrapper}>
          <Image
            source={require('../../assets/Plano_Fundo/sucessoconsul.jpeg')}
            style={[styles.backgroundImage, { width, height }]}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </View>

        <View style={{ paddingHorizontal: 35, alignItems: 'center', marginTop: 50, pointerEvents: 'box-none' }}>
          <View style={[styles.content, { top: height * 0.15 }]}>
            <Image
              source={require('../../assets/icones/CorretoIcon.png')}
              style={styles.topLeftImage}
            />
            <Text style={styles.title}>
              Obrigado pela Preferência!
            </Text>
            <Text style={styles.subtitle}>
              Sua consulta foi marcada com sucesso.
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  content: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    borderRadius: 2,
    borderColor: '#fff',
    borderWidth: 4,
  },
  title: {
    color: '#fff',
    letterSpacing: 1,
    fontSize: 30,
    textAlign: 'center',
    marginTop: 15,
    fontFamily: 'Findel1',
  },
  subtitle: {
    color: '#fff',
    letterSpacing: 1,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 10,
    fontFamily: 'Alice',
  },
  topLeftImage: {
    position: 'absolute',
    top: -40,
    left: -25,
    width: 60,
    height: 60,
  },
});
