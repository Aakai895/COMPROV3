import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,
  StatusBar, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BackgroundWaves from '../../Style/Backgrounds/Bem_vindo';
import { getResponsiveSizes } from '../../Style/Responsive';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';

export default function Bem_Vindo3() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
      Alice: require('../../fonts/Alice-Regular.ttf'),
      Findel: require('../../fonts/Findel-Display-Regular.otf'),
    });

  if (!fontsLoaded) return null;

  const {
    titleFontSize,
    subtitleFontSize,
    captionFontSize,
    dotSize,
    buttonPaddingH,
    buttonPaddingV,
    buttonFontSize,
    logoWidth,
    logoHeight,
  } = getResponsiveSizes(width, height);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <BackgroundWaves />

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
              backgroundColor: index === 2 ? '#a5c3a7' : '#ccc',
              marginHorizontal: dotSize * 0.6,
            }} />
          </TouchableWithoutFeedback>
        ))}
      </View>

      <View
        style={[styles.content, {
          paddingBottom: height * 0.08,
          paddingHorizontal: width * 0.07,
        }]}
      >

        <View
          style={[styles.logoBox, {
            width: logoWidth * 1.3,
            height: logoHeight * 1.8,
            marginBottom: height * 0.12,
          }]}
        >

          <Image
            source={require('../../assets/Logo.png')}
            style={{
              transform: [{ scale: 1.4 }],
              width: logoWidth,
              height: logoHeight,
              resizeMode: 'contain',
            }}
          />
          <Text
            style={{
              fontFamily: 'Findel',
              fontSize: 20,
              marginTop: 5
            }}
          >
            COMPRO
          </Text>
        </View>

        <Text
          style={[styles.title, {
            fontSize: titleFontSize,
            fontFamily: 'Findel',
            marginBottom: height * 0.012,
          }]}
        >
          BEM-VINDO!
        </Text>

        <View style={[styles.textBlock, { marginBottom: height * 0.13 }]}>
          <View
            style={[styles.textBlockBar, {
              marginRight: width * 0.03,
            }]}
          />

          <View style={{ flex: 1 }}>
            <Text
              style={[styles.description, {
                fontSize: subtitleFontSize,
                lineHeight: subtitleFontSize * 1.4,
                marginBottom: height * 0.005,
              }]}
            >
              Prepare-se para uma nova experiência de autonomia, eficiência e qualidade de vida.
            </Text>
            <Text
              style={[
                styles.caption, {
                  fontSize: captionFontSize,
                  marginTop: height * 0.012,
              }]}
            >
              O futuro começa agora!
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.buttonOutline, {
                paddingHorizontal: buttonPaddingH,
                paddingVertical: buttonPaddingV,
                minWidth: width * 0.35,
                maxWidth: 300,
              },
            ]}
            onPress={() => navigation.navigate('TipoCadastro')}
          >
            <Text style={[styles.buttonText, { fontSize: buttonFontSize }]}>
              Cadastrar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buttonFill, {
                paddingHorizontal: buttonPaddingH,
                paddingVertical: buttonPaddingV,
                minWidth: width * 0.25,
                maxWidth: 300,
              },
            ]}
            onPress={() => navigation.navigate('Login')} 
          >
            <Text style={[styles.buttonTextFill, { fontSize: buttonFontSize }]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
  },
  content:{
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logoBox:{
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
  title: {
    color: '#fff',
    letterSpacing: 1,
  },
  textBlock:{
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textBlockBar:{
    width: 2,
    height: '100%',
    backgroundColor: '#fff',
  },
  description:{
    color: '#fff',
    fontFamily: 'Alice',
  },
  caption: {
    color: '#fff',
    fontFamily: 'Alice',
    fontWeight: 'bold',
  },
  buttonContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  buttonOutline:{
    borderColor: '#6d8b89',
    borderWidth: 2,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
  },
  buttonFill:{
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
  },
  buttonText:{
    color: '#fff',
    fontFamily: 'Alice',
  },
  buttonTextFill:{
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'Alice',
  },
});
