import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Home({ navigation }) {
  const [abaAtiva, setAbaAtiva] = useState('especialidades');

  const renderConteudo = () => {
    if (abaAtiva === 'especialidades') {
      return (
        <View>
          <Text style={styles.tituloConteudo}>Especialidades</Text>

          <View style={styles.linhaEspecialidades}>
            <View style={styles.cardespecialidade}>
              <Image source={require('../../assets/Plano_Fundo/ExploreApp.jpg.png')} style={styles.especialidade} />
              <View style={styles.infoEspecialidade}>
                <FontAwesome name="plus-circle" size={20} color="#d3dfb3" />
                <Text style={styles.textoEspecialidade}>Cardiologia</Text>
              </View>
            </View>

            <View style={styles.cardespecialidade}>
              <Image source={require('../../assets/Plano_Fundo/ExploreApp.jpg.png')} style={styles.especialidade} />
              <View style={styles.infoEspecialidade}>
                <FontAwesome name="plus-circle" size={20} color="#d3dfb3" />
                <Text style={styles.textoEspecialidade}>Psicólogo</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.agendar} onPress={() => navigation.navigate('Agendamento')}>
            <Text style={styles.textoAgendar}>Agendar</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (abaAtiva === 'avaliacoes') {
      return (
        <View>
          <View style={styles.avaliarContainer}>
            <EvilIcons name="pencil" size={20} color="#a5c3a7" />
            <Text style={styles.avaliarTexto}>Avaliar</Text>
          </View>

          <TextInput
            style={styles.formtext}
            placeholder="Procurar por avaliações"
            placeholderTextColor="#000000"
          />

          <View style={styles.filtrosContainer}>
            <View style={styles.cinza}>
              <MaterialCommunityIcons name="tune" size={16} color="#737373" />
              <Text style={styles.textoFiltro}>Filtro</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#737373" />
            </View>

            <View style={styles.verde}>
              <Text style={styles.textoFiltroVerde}>Recentes</Text>
            </View>

            <View style={styles.cinza2}>
              <Text style={styles.textoFiltroCinza}>Antigos</Text>
            </View>
          </View>

          <View style={styles.linhaDivisoria} />

          <TouchableOpacity style={styles.agendar2} onPress={() => navigation.navigate('Agendamento')}>
            <Text style={styles.textoAgendar}>Agendar</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (abaAtiva === 'sobre') {
      return (
        <View>
          <Text style={styles.tituloConteudo}>Sobre Nós</Text>
          <Text style={styles.textoSobre}>
            Aqui estaria um texto sobre a clínica, porém estou com preguiça de desenvolver algo
          </Text>

          <Text style={styles.tituloConteudo2}>Horas Que Trabalhamos</Text>
          <View style={styles.linhaDivisoriaMenor} />

          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((dia, index) => (
            <View key={index} style={styles.horarioLinha}>
              <Text style={styles.textoHorario}>{dia}</Text>
              <Text style={styles.textoHorario}>00:00 - 00:00</Text>
            </View>
          ))}

          <View style={styles.linhaDivisoria} />

          <TouchableOpacity style={styles.agendar2} onPress={() => navigation.navigate('Agendamento')}>
            <Text style={styles.textoAgendar}>Agendar</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../assets/Plano_Fundo/ExploreApp.jpg.png')} style={styles.banner} />

      <View style={styles.whitecard}>
        <View style={styles.estrelacinza}>
          <FontAwesome name="star" size={16} color="white" />
          <FontAwesome name="star" size={16} color="white" />
          <FontAwesome name="star" size={16} color="white" />
          <FontAwesome name="star" size={16} color="white" />
          <FontAwesome name="star-half-empty" size={16} color="white" />
        </View>

        <View style={styles.headerClinica}>
          <Text style={styles.nomeClinica}>Carvalho de Oliveira</Text>
          <Text style={styles.avaliacoesTexto}>(500+ Avaliações)</Text>
        </View>

        <Text style={styles.descricaoClinica}>
          Fisioterapia, atendimento psicológico  manutenção de prótese
        </Text>

        <View style={styles.linhaSeparadora} />

        <View style={styles.caixaverde}>
          <View style={styles.linhaEndereco}>
            <View style={styles.iconeFundo}>
              <Entypo name="location-pin" size={16} color="#6d8b89" />
            </View>
            <Text style={styles.textoCaixaVerde}>
              Praça Menezes de Andrade, 20 - Embu das Artes - SP.
            </Text>
          </View>

          <View style={styles.linhaEndereco}>
            <View style={styles.iconeFundo}>
              <Feather name="clock" size={16} color="#6d8b89" />
            </View>
            <Text style={styles.textoCaixaVerde}>
              1 Hora • 50km • Seg Sex | 07:00 - 18:00 Tarde
            </Text>
          </View>
        </View>

        <View style={styles.nav}>
          <TouchableOpacity onPress={() => setAbaAtiva('especialidades')}>
            <Text style={[styles.navItem, abaAtiva === 'especialidades' && styles.navItemAtivo]}>
              Especialidades
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAbaAtiva('avaliacoes')}>
            <Text style={[styles.navItem, abaAtiva === 'avaliacoes' && styles.navItemAtivo]}>
              Avaliações
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAbaAtiva('sobre')}>
            <Text style={[styles.navItem, abaAtiva === 'sobre' && styles.navItemAtivo]}>
              Sobre Nós
            </Text>
          </TouchableOpacity>
        </View>

        {renderConteudo()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  banner: { width: '100%', height: 150, borderTopWidth: 1 },
  whitecard: { borderRadius: 15, padding: 8, backgroundColor: 'white', marginTop: -50 },
  estrelacinza: {
    backgroundColor: '#000000', width: '45%', borderRadius: 15,
    paddingVertical: 8, paddingHorizontal: 30, marginLeft: 'auto', marginRight: 'auto',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'
  },
  headerClinica: {
    flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginRight: 10,
    justifyContent: 'space-between', marginTop: 15
  },
  nomeClinica: { fontFamily: 'Alice-Regular', fontSize: 16, fontWeight: 'bold' },
  avaliacoesTexto: { fontFamily: 'Alice-Regular', fontSize: 10, color: '#6d8b89' },
  descricaoClinica: { fontFamily: 'Alice-Regular', fontSize: 12, color: '#1c404b', marginTop: 8, marginHorizontal: 10 },
  linhaSeparadora: { height: 1, backgroundColor: '#a5c3a7', marginHorizontal: 10, marginTop: 15 },
  caixaverde: { backgroundColor: '#6d8b89', marginHorizontal: 10, padding: 8, borderRadius: 10 },
  linhaEndereco: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  iconeFundo: { backgroundColor: 'white', borderRadius: 50, padding: 3 },
  textoCaixaVerde: { color: 'white', fontFamily: 'Alice-Regular', fontSize: 11, marginLeft: 5 },
  nav: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  navItem: { fontFamily: 'Alice-Regular', fontSize: 14, color: '#6d8b89', paddingBottom: 5 },
  navItemAtivo: { color: '#000', fontWeight: 'bold', borderBottomWidth: 2, borderBottomColor: '#000' },
  tituloConteudo: { marginTop: 15, fontSize: 14, fontWeight: 600, fontFamily: 'Alice-Regular', marginLeft: 10 },
  linhaEspecialidades: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 15,
    justifyContent: 'space-between', marginTop: 10
  },
  cardespecialidade: { borderWidth: 2, width: '45%', borderColor: '#d9d9d9', borderRadius: 10 },
  especialidade: { width: '100%', borderTopRightRadius: 10, borderTopLeftRadius: 10, height: 100 },
  infoEspecialidade: { flexDirection: 'row', alignItems: 'center', marginLeft: 4, padding: 5 },
  textoEspecialidade: { fontFamily: 'Alice-Regular', fontSize: 12, marginLeft: 6 },
  agendar: {
    width: '80%', borderRadius: 20, backgroundColor: '#6d8b89', marginTop: 20, padding: 8,
    alignSelf: 'center', marginBottom: 10
  },
  agendar2: {
    width: '80%', borderRadius: 20, backgroundColor: '#6d8b89', marginTop: 10, padding: 8,
    alignSelf: 'center', marginBottom: 10
  },
  textoAgendar: { fontFamily: 'Alice-Regular', fontSize: 15, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  avaliarContainer: { marginLeft: 'auto', marginRight: 15, flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  avaliarTexto: { fontFamily: 'Alice-Regular', fontSize: 11, color: '#a5c3a7', textAlign: 'center' },
  formtext: {
    padding: 6, paddingLeft: 12, borderRadius: 25, borderWidth: 2, borderColor: '#d9d9d9',
    marginHorizontal: 10, marginTop: 5, backgroundColor: 'white', fontFamily: 'Alice-Regular'
  },
  filtrosContainer: {
    flexDirection: 'row', alignItems: 'center', width: '70%', justifyContent: 'space-around',
    marginTop: 10, alignSelf: 'center'
  },
  textoFiltro: { color: '#737373', fontFamily: 'Alice-Regular', fontSize: 11, marginHorizontal: 4 },
  textoFiltroVerde: { color: 'white', fontFamily: 'Alice-Regular', fontSize: 11 },
  textoFiltroCinza: { color: '#545454', fontFamily: 'Alice-Regular', fontSize: 11 },
  cinza: {
    paddingVertical: 3, borderColor: '#d9d9d9', borderRadius: 20, flexDirection: 'row',
    alignItems: 'center', borderWidth: 2, paddingHorizontal: 5
  },
  verde: {
    paddingVertical: 7, borderColor: '#a5c3a7', borderRadius: 20, borderWidth: 2,
    paddingHorizontal: 8, backgroundColor: '#a5c3a7'
  },
  cinza2: {
    paddingVertical: 7, borderColor: '#d9d9d9', borderRadius: 20, borderWidth: 2, paddingHorizontal: 8
  },
  linhaDivisoria: { height: 2, backgroundColor: '#d9d9d9', marginTop: 15, marginBottom: 5 },
  textoSobre: { fontSize: 11, fontFamily: 'Alice-Regular', color: '#737373', marginHorizontal: 10, marginTop: 6 },
  tituloConteudo2: { marginTop: 20, fontSize: 14, fontWeight: 600, fontFamily: 'Alice-Regular', marginLeft: 10 },
  linhaDivisoriaMenor: { height: 2, backgroundColor: '#d9d9d9', marginTop: 8, marginBottom: 10, marginHorizontal: 10 },
  horarioLinha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 4 },
  textoHorario: { fontFamily: 'Alice-Regular', color: '#737373', fontSize: 11 },
});
