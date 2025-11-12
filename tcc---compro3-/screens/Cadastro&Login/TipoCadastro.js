import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,
  ImageBackground, useWindowDimensions, SafeAreaView, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { getResponsiveSizes } from '../../Style/Responsive';
import { BlurView } from 'expo-blur';

export default function CadastroTipo() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    Alice: require('../../fonts/Alice-Regular.ttf'),
    Findel: require('../../fonts/Findel-Display-Regular.otf'),
  });

  if (!fontsLoaded) return null;

  const { titleFontSize, subtitleFontSize } = getResponsiveSizes(width, height);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/Plano_Fundo/TipoCadastro.jpg')}
        style={[
          styles.background,{
            width: width * 1.4,
            height,
            marginLeft: -width * 0.2,
          },
        ]}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.35)']}
          style={StyleSheet.absoluteFill}
        />

        <SafeAreaView style={styles.safe}>
          <View style={styles.topContent}>
            <Image
              source={require('../../assets/Logo.png')}
              style={[styles.logo, { width: width * 0.25, height: width * 0.25 }]}
              resizeMode="contain"
            />

            <Text style={[styles.title, { fontSize: titleFontSize, fontFamily: 'Findel' }]}>
              CADASTRE-SE
            </Text>

            <Text style={[styles.subtitle,{
                fontSize: subtitleFontSize,
                lineHeight: subtitleFontSize * 1.4,
                fontFamily: 'Alice',
                marginTop: 15,
              }]}
            >
              Escolha como deseja se cadastrar:{"\n"}selecione uma das três opções disponíveis.
            </Text>
          </View>

          <BlurView intensity={30} style={styles.card}>
            <TouchableOpacity
              style={[styles.button, styles.buttonWhite]}
              onPress={() => navigation.navigate('CadastroUsuario')}
            >
              <Text style={[styles.buttonText, { color: '#000', fontSize: subtitleFontSize }]}>
                Usuário
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonGray]}
              onPress={() => navigation.navigate('CadastroClinica')}
            >
              <Text style={[styles.buttonText, { color: '#333', fontSize: subtitleFontSize }]}>
                Clínica
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonBlack]}
              onPress={() => navigation.navigate('CadastroEmpresa')}
            >
              <Text style={[styles.buttonText, { color: '#fff', fontSize: subtitleFontSize }]}>
                Empresa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[
                  styles.loginText, {
                    fontSize: subtitleFontSize * 0.85,
                    fontFamily: 'Alice',
                  },
                ]}
              >
                Já possui uma conta? <Text style={styles.loginBold}>Logar</Text>
              </Text>
            </TouchableOpacity>
          </BlurView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  topContent: {
    alignItems: 'center',
    width: '100%',
  },
  background: {
    flex: 1,
  },
  logo: {
    marginBottom: 30,
  },
  title: {
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    width: '90%',
    maxWidth: 350,
    borderRadius: 10,
    paddingVertical: 25,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    gap: 16,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonWhite: {
    backgroundColor: '#fff',
  },
  buttonGray: {
    backgroundColor: '#d1d1d1',
  },
  buttonBlack: {
    backgroundColor: '#000',
  },
  buttonText: {
    fontWeight: 'bold',
    fontFamily: 'Alice',
    textAlign: 'center',
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  loginBold: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#c2f08e',
  },
});
