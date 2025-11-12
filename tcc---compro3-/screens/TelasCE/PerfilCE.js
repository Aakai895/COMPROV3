import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image,
  Platform, StatusBar, TouchableOpacity, ScrollView,
  Modal,} from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';

export default function Home({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogoutPress = () => {
    setModalVisible(true);
  };

  const handleConfirmLogout = () => {
    setModalVisible(false);
    navigation.navigate('Login'); 
  };

  const handleCancelLogout = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.profileContainer}
          onPress={() => navigation.navigate('Avaliacoes')}
        >
          <Image source={require('../../assets/Plano_Fundo/ExploreApp.jpg.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              Lorena Alvarado</Text>
            <Text style={styles.profileEmail}>
              lorenaalvarado@gmail.com
            </Text>
          </View>
          <Octicons name="chevron-right" size={40} color="#ff788a" style={styles.chevron} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionContainer}
          onPress={() => navigation.navigate('Avaliacoes')}
        >
          <View style={styles.optionLeft}>
            <Image source={require('../../assets/icones/Estrela.png')}
              style={styles.iconImage3}
              resizeMode="contain"
            />
            <Text style={styles.optionText}>
              Avaliações
            </Text>
          </View>
          <Octicons name="chevron-right" size={40} color="#ff788a" style={styles.chevron} />
        </TouchableOpacity>

        <View style={styles.divider} />
        
        <TouchableOpacity style={styles.optionContainer}
          onPress={() => navigation.navigate('PerguntasFreqCE')}
        >
          <View style={styles.optionLeft}>
            <Image source={require('../../assets/icones/PeguntasFreqIcon.png')}
              style={styles.iconImage}
              resizeMode="contain"
            />
            <Text style={styles.optionText}>
              Perguntas Frequentes
            </Text>
          </View>
          <Octicons name="chevron-right" size={40} color="#ff788a" style={styles.chevron} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.optionContainer}
          onPress={() => navigation.navigate('ConfiguracoesCE')}
        >
          <View style={styles.optionLeft}>
            <Image source={require('../../assets/icones/ConfiguracoesIcon.png')}
              style={styles.iconImage}
              resizeMode="contain"
            />
            <Text style={styles.optionText}>Configurações</Text>
          </View>
          <Octicons name="chevron-right" size={40} color="#ff788a" style={styles.chevron} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.optionContainer}
          onPress={() => navigation.navigate('SuporteCE')}
        >
          <View style={styles.optionLeft}>
            <Image source={require('../../assets/icones/SuporteIcon.png')}
              style={styles.iconImage}
              resizeMode="contain"
            />
            <Text style={styles.optionText}>
              Suporte
            </Text>
          </View>
          <Octicons name="chevron-right" size={40} color="#ff788a" style={styles.chevron} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.optionContainer}
          onPress={() => navigation.navigate('PoliticaPrivCE')}
        >
          <View style={styles.optionLeft}>
            <Image source={require('../../assets/icones/SeguPrivacidadeIcon.jpg')}
              style={styles.iconImage}
              resizeMode="contain"
            />
            <Text style={styles.optionText}>
              Política de Privacidade
            </Text>
          </View>
          <Octicons name="chevron-right" size={40} color="#ff788a" style={styles.chevron} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.optionContainer}
          onPress={handleLogoutPress}
        >
          <View style={styles.optionLeft}>
            <Image source={require('../../assets/icones/SairIcon.png')}
              style={styles.iconImage}
              resizeMode="contain"
            />
            <Text style={styles.optionText}>
              Sair
            </Text>
          </View>
          <Octicons name="chevron-right" size={40} color="#ff788a" style={styles.chevron} />
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalTopDivider} />

            <Text style={styles.modalTitle}>
              Sair
            </Text>
            <View style={styles.modalDivider} />

            <Text style={styles.modalMessage}>
              Você tem certeza que deseja sair de sua{"\n"}conta?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtnSair, styles.exitBtn]}
                onPress={handleConfirmLogout}
              >
                <Text style={styles.exitBtnText}>
                  Sair
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]}
                onPress={handleCancelLogout}
              >
                <Text style={styles.cancelBtnText}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  profileContainer: {
    backgroundColor: '#1d1d1b',
    padding: 12,
    width: '100%',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 16,
  },
  profileImage: {
    height: 60,
    width: 60,
    borderRadius: 100,
  },
  profileInfo: {
    flexDirection: 'column',
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Alice-Regular',
  },
  profileEmail: {
    fontSize: 14,
    color: 'white',
    marginTop: 4,
    fontFamily: 'Alice-Regular',
  },
  chevron: {
    marginLeft: 'auto',
  },
  optionContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 24,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconImage: {
    width: 28,
    height: 28,
  },
  iconImage3: {
    width: 36,
    height: 36,
  },
  optionText: {
    fontSize: 20,
    marginLeft: 12,
    fontFamily: 'Alice-Regular',
    color: '#000',
  },
  divider: {
    height: 2.6,
    width: '90%',
    backgroundColor: '#d9d9d9',
    alignSelf: 'center',
    marginTop: 16,
  },
  modalTopDivider: {
    width: 120,
    height: 3,
    borderRadius: 100,
    backgroundColor: '#d9d9d9',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Alice-Regular',
    marginBottom: 10,
  },
  modalDivider: {
    width: '90%',
    height: 2,
    backgroundColor: '#d9d9d9',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#555',
  },
  modalBtnSair: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#47667b',
  },
  exitBtn: {
    backgroundColor: '#415A6B',
  },
  exitBtnText: {
    color: '#fff',
    fontSize: 18,
  },
  cancelBtn: {
    backgroundColor: '#fff',
    borderColor: '#aaa',
  },
  cancelBtnText: {
    color: '#555',
    fontSize: 18,
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'Alice-Regular',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'flex-end',
},
  modalBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    // ADICIONADO:
    paddingBottom: Platform.OS === 'android' ? 30 : 40,
    // REMOVER: minHeight: 280,  -> Pode causar problemas visuais
  },
});
