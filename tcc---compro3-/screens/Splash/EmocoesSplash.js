import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback,
  Animated, SafeAreaView, useWindowDimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { getResponsiveSizes } from '../../Style/Responsive';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

export default function Bem_Vindo1() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [fontsLoaded] = useFonts({
    Alice: require('../../fonts/Alice-Regular.ttf'),
    Findel1 : require('../../fonts/Findel-Display-Regular.otf'),
  });

  if (!fontsLoaded) return null;

  const {
    circleSize ,
    circleFontSize,
    arrowSize,
  } = getResponsiveSizes(width, height);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handleContinue = async () => {
    await AsyncStorage.setItem('@emocoes_splash_seen', 'true');
    navigation.replace('Emocoes');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.imageWrapper}>
          <Image source={require('../../assets/Plano_Fundo/SplashEmocoes.png')}
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

        <View style={[styles.content, { top: height * 0.15 }]}>
          <Text style={[styles.title, {
            fontFamily: 'Findel',
            }]}
          >
            “ Estamos aqui para {'\n' }monitorar e ajudar com  {'\n' }sua jornada de humor! ” 
          </Text>
        </View>

        <TouchableWithoutFeedback onPressIn={handlePressIn}
          onPress={() => navigation.navigate('TelasUsuario', { screen: 'Emoções' })}
        >
          <View style={[styles.buttonWrapper, {
            bottom: height * 0.04,
            right: width * 0.10,
            }]}
          >
            <Text style={[styles.buttonText, {
              marginRight: -width * 0.05,
              fontSize: circleFontSize,
              }]}
            >
              Começar
            </Text>

            <Animated.View
              style={[ styles.circleButton, {
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                transform: [{ scale: scaleAnim }],
              }]}
            >
              <Feather name="arrow-up-right" size={arrowSize} color="#fff" />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </View>
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
  },
  title: {
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 10,
    fontSize: 30,
    textAlign: 'center',
    marginTop: 75,
  },
  buttonWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Alice',
    color: '#fff',
  },
  circleButton: {
    borderWidth: 1,
    borderColor: '#bebfba',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});