import React from 'react';
import { View, Text, StyleSheet,  SafeAreaView, Image,
 TouchableOpacity, ScrollView, Linking, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function Seguro() {
  const navigation = useNavigation();

  const handleDownloadPDF = () => {
    Linking.openURL('https://example.com/contrato.pdf');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
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

        <Text style={styles.headerTitle}>Políticas de privacidade</Text>
      </View>

      <View style={styles.contentArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentWrapper}>
            <Text style={styles.title}>Termos & Condições</Text>

            <Text style={styles.paragraph}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              lectus purus, bibendum quis facilisis et, pulvinar nec nulla.
              Duis placerat volutpat tincidunt.
            </Text>

            <Text style={styles.paragraph}>
              Phasellus sollicitudin bibendum blandit. Curabitur ac tempus leo.
              Pellentesque sit amet leo dignissim, porttitor augue vitae,
              molestie nulla.
            </Text>

            <Text style={styles.downloadText}>
              Baixe o PDF para visualizar nossa{' '}
              <Text style={styles.highlight}>Políticas de privacidade</Text>
            </Text>

            <TouchableOpacity style={styles.imageButton} onPress={handleDownloadPDF}>
              <Image
                source={require('../../assets/icones/pdfIcon.webp')}
                style={styles.pdfIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>

        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.3)', 
            'rgba(0, 0, 0, 0.2)', 
            'rgba(0, 0, 0, 0.0)',
          ]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradientShadow}
        />

        <Image
          source={require('../../assets/Plano_Fundo/apertoMao_Politica.png')}
          style={styles.footerImage}
          resizeMode="contain"
        />

        <View style={styles.footer} />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentWrapper: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    color: '#6d8b89',
    fontSize: 24,
  },
  paragraph: {
    color: '#000',
    fontSize: 16,
    marginTop: 12,
    lineHeight: 24,
  },
  downloadText: {
    fontSize: 16,
    marginTop: 24,
    color: '#000',
  },
  highlight: {
    color: '#6d8b89',
  },
  imageButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  pdfIcon: {
    width: 80,
    height: 80,
  },
  gradientShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300, 
    zIndex: 0,
  },
  footerImage: {
    position: 'absolute',
    bottom: -40,
    width: '100%',
    height: 400,
    alignSelf: 'center',
  },
  footer: {
    height: 40,
    backgroundColor: '#6d8b89',
  },
});
