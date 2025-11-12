import React, { useRef } from 'react';
import { View, StyleSheet, Text, Image, TouchableWithoutFeedback,
  Animated, SafeAreaView, useWindowDimensions} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { getResponsiveSizes } from '../../Style/Responsive';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

export default function Bem_Vindo2() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [fontsLoaded] = useFonts({
    Alice: require('../../fonts/Alice-Regular.ttf'),
    Findel: require('../../fonts/Findel-Display-Regular.otf'),
  });

  if (!fontsLoaded) return null;

 const {
    titleFontSize,
    subtitleFontSize,
    dotSize,
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

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('Bem_Vindo3');
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.imageWrapper}>
          <Image
            source={require('../../assets/Plano_Fundo/Mao_Bem.V2.jpg')}
            style={[styles.rotatedImage, {
              width: height * 1.1,
              height: width * 1.1,
              top: (height - width) / 2,
              left: (width - height) / 2,
            }]}
            resizeMode="cover"
          />
          <View style={[styles.gradientOverlay, {
            width: height * 1.1,
            height: width * 1.1,
            top: (height - width) / 2,
            left: (width - height) / 2,
            }]}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
              style={{ flex: 1 }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>
        </View>

        <View style={[styles.indicatorContainer, { top: height * 0.06 }]}>
          {[0, 1, 2].map((index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => {
                if (index === 0) navigation.navigate('Bem_Vindo1');
                if (index === 1) navigation.navigate('Bem_Vindo2');
                if (index === 2) navigation.navigate('Bem_Vindo3');
              }}
            >
              <View style={{
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: index === 1 ? '#a5c3a7' : '#ccc',
                marginHorizontal: dotSize * 0.6,
                }} 
              />
            </TouchableWithoutFeedback>
          ))}
        </View>

        <View style={[styles.content, { top: height * 0.15 }]}>
          <Text style={[styles.title, {
            fontSize: titleFontSize,
            fontFamily: 'Findel',
            }]}
          >
            BEM-VINDO
          </Text>
          
          <View style={[styles.separator, { marginBottom: height * 0.015 }]} /> 
          <Text style={[styles.description, {
            fontSize: subtitleFontSize,
            lineHeight: subtitleFontSize * 1.4
            }]}
          >
            Oferecemos próteses inteligentes,{'\n'}
            controladas pelo seu pensamento, com{'\n'}
            precisão, conforto e segurança.
          </Text>
        </View>

        <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
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
              Próximo
            </Text>

            <Animated.View style={[
              styles.circleButton, {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotatedImage: {
    position: 'absolute',
    transform: [{ rotate: '90deg' }],
  },
  gradientOverlay: {
    position: 'absolute',
    transform: [{ rotate: '90deg' }],
  },
  indicatorContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
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
    fontFamily: 'Findel',
  },
  separator: {
    width: '60%',
    height: 1,
    backgroundColor: '#fff',
  },
  description: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Alice',
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
