import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ScrollView, TextInput, LayoutAnimation, UIManager, Platform,
  Image, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import FundoFAQChat from '../../Style/Backgrounds/FAQ&Chat_Fundo';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FAQ() {
  const navigation = useNavigation();

  const [expanded, setExpanded] = useState(null);
  const [searchText, setSearchText] = useState('');

  const toggleExpand = (key) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === key ? null : key);
  };

  const perguntas = [
    {
      pergunta: 'O que é COMPRO?',
      resposta: 'Somos uma empresa comprometida em promover a acessibilidade às próteses para todas as pessoas que delas necessitam, com o objetivo de proporcionar uma melhor qualidade de vida.',
    },
    {
      pergunta: 'Meus dados estão seguros na plataforma?',
      resposta: 'Sim, utilizamos protocolos de segurança e criptografia.',
    },
    {
      pergunta: 'Como entro em contato com suporte?',
      resposta: 'Você pode acessar a aba de Perfil no menu principal e clicar na opção Suporte.',
    },
    {
      pergunta: 'Onde vejo o contrato do Seguro?',
      resposta: 'O contrato está disponível na aba Perfil, na opção Seguro.',
    },
    {
      pergunta: 'Posso cancelar meu seguro a qualquer \n momento?',
      resposta: 'Sim, o cancelamento pode ser feito através do Suporte, falando com um de nossos atendentes via chamada ou chat.',
    },
    {
      pergunta: 'Como sei se meu pagamento foi aprovado?',
      resposta: 'Você receberá uma notificação e poderá verificar o status na aba "Pagamentos" nas configurações.',
    },
    {
      pergunta: 'A plataforma funciona offline?',
      resposta: 'Infelizmente nossa platafoma não funciona offline.',
    },
    {
      pergunta: 'Como faço para excluir minha conta?',
      resposta: 'Você pode solicitar a exclusão na seção de configurações, em "Excluir conta".',
    },
    {
      pergunta: 'Qual a idade mínima para usar o app?',
      resposta: 'A idade mínima recomendada é de 18 anos.',
    },
    {
      pergunta: 'Como funciona o suporte por chat?',
      resposta: 'O suporte por chat está disponível em horário comercial, via aba "Suporte".',
    },
  ];

  const perguntasFiltradas = perguntas.filter(item =>
    item.pergunta.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <FundoFAQChat />

      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('TelasUsuario')}>
          <Image
            source={require('../../assets/icones/SetaVoltar.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Perguntas frequentes</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={30} color="#555" style={{ marginRight: 6 }} />
        <TextInput
          placeholder="Procurar"
          placeholderTextColor="#000"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {perguntasFiltradas.map((item) => (
          <View key={item.pergunta} style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => toggleExpand(item.pergunta)}
            >
              <Text style={styles.cardTitle}>{item.pergunta}</Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={30}
                color="#444"
                style={expanded === item.pergunta ? { transform: [{ rotate: '180deg' }] } : {}}
              />
            </TouchableOpacity>
            {expanded === item.pergunta && (
              <>
                <View style={styles.divider} />
                <Text style={styles.cardContent}>{item.resposta}</Text>
              </>
            )}
          </View>
        ))}

        {perguntasFiltradas.length === 0 && (
          <Text style={{ textAlign: 'center', color: '#888', fontSize: 18, marginTop: 40 }}>
            Nenhuma pergunta encontrada.
          </Text>
        )}
      </ScrollView>
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
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 26,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 100,
    backgroundColor: '#fff',
    borderColor: '#d9d9d9',
    borderWidth: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 20,
    color: '#000',
  },
  scrollContent: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 2,
    borderColor: '#d9d9d9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  cardContent: {
    marginTop: 8,
    fontSize: 18,
    color: '#573122',
    lineHeight: 18,
  },
  divider: {
    height: 2,
    backgroundColor: '#d9d9d9',
    marginTop: 12,
    marginBottom: 10,
  },
});
