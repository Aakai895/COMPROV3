import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  Image, ScrollView, Dimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const ClinicaIcon = require('../../assets/icones/ClinicaIcon.png');
const EmpresaIcon = require('../../assets/icones/EmpresaIcon.png');
const LapisIcon = require('../../assets/icones/lapisIcon.png');
const BannerProximos = require('../../assets/Plano_Fundo/Medico.png');

export default function MinhasConsultas() {
  const navigation = useNavigation();
  const [aba, setAba] = useState('proximos');
  const [detalhesVisiveis, setDetalhesVisiveis] = useState({});

  const todasConsultas = [
    {
      id: '1',
      tipo: 'Clínica',
      nome: 'Alvaro Mendes',
      endereco: 'Rua Mathias Cardoso, 321 - Itapecerica da Serra - SP.',
      data: 'Segunda, 30 de agosto de 2025',
      horario: '8:30 - 9:15',
      doutor: 'Fabio',
      status: 'proximos',
      statusAvaliacao: '',
    },
    {
      id: '2',
      tipo: 'Empresa',
      nome: 'Alvaro Mendes',
      endereco: 'Rua Michael do Santos, 035 - Taboão da Serra - SP.',
      data: 'Segunda, 30 de agosto de 2025',
      horario: '8:30 - 9:15',
      doutor: 'Fabio',
      status: 'proximos',
      statusAvaliacao: '',
    },
    {
      id: '3',
      tipo: 'Clínica',
      nome: 'Maria Silva',
      endereco: 'Av. Brasil, 100 - São Paulo - SP.',
      data: 'Terça, 31 de agosto de 2025',
      horario: '10:00 - 10:45',
      doutor: 'Ana',
      status: 'concluidos',
      statusAvaliacao: '',
    },
    {
      id: '4',
      tipo: 'Empresa',
      nome: 'João Pereira',
      endereco: 'Rua das Flores, 500 - Campinas - SP.',
      data: 'Quarta, 1 de setembro de 2025',
      horario: '14:00 - 14:30',
      doutor: 'Carlos',
      status: 'concluidos',
      statusAvaliacao: 'avaliado',
    },
    {
      id: '5',
      tipo: 'Clinica',
      nome: 'João Pereira',
      endereco: 'Rua das Flores, 500 - Campinas - SP.',
      data: 'Quarta, 1 de setembro de 2025',
      horario: '14:00 - 14:30',
      doutor: 'Carlos',
      status: 'cancelados',
      statusAvaliacao: 'avaliado',
    },
  ];

  const toggleDetalhes = (consultaId) => {
    setDetalhesVisiveis(prev => ({ ...prev, [consultaId]: !prev[consultaId] }));
  };

  const consultasFiltradas = todasConsultas.filter(c => c.status === aba);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton}
          onPress={() => navigation.navigate('TelasUsuario')} 
        >
          <Image source={require('../../assets/icones/SetaVoltar.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Minhas Consultas
        </Text>

        <TouchableOpacity style={styles.cartButton}
          onPress={() => navigation.navigate('Carrinho')}
        >
          <Image source={require('../../assets/icones/Carrinho_Verde.png')}
            style={styles.cartIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setAba('proximos')} style={styles.tab}>
          <Text style={[styles.tabText, aba === 'proximos' && styles.activeTabText]}>
            Próximos
          </Text>
          {aba === 'proximos' && 
          <View style={styles.trapezio} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setAba('concluidos')} style={styles.tab}>
          <Text style={[styles.tabText, aba === 'concluidos' && styles.activeTabText]}>
            Concluídos
          </Text>
          {aba === 'concluidos' && 
          <View style={styles.trapezio} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setAba('cancelados')} style={styles.tab}>
          <Text style={[styles.tabText, aba === 'cancelados' && styles.activeTabText]}>
            Cancelados
          </Text>
          {aba === 'cancelados' && 
          <View style={styles.trapezio} />}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
        {aba === 'proximos' && (
          <ImageBackground source={require('../../assets/Plano_Fundo/Banner.png')} style={styles.banner}>
            <View style={styles.proximosHeaderContainer}>
              <Text style={styles.proximosMinhasText}>Minhas</Text>
              <Text style={styles.proximosConsultasText}> Consultas</Text>
            </View>

            <View style={styles.boxverde}>
              <View style={styles.next}>
                <Image source={require('../../assets/icones/calendarioIcon.png')} 
                  style={styles.calendarIcon} 
                />
                <Text style={styles.proximosNextText}>
                  Próxima consulta
                </Text>
              </View>
              <Text style={styles.proximosConsultaClinicaText}>Consulta - Clínica</Text>
              <Text style={styles.proximosSmallTextMarginTop3}>Clínica: Carvalho de Oliveira.</Text>
              <Text style={styles.proximosSmallTextMarginTop1}>Endereço: …Embu das Artes ‑ SP.</Text>
              <Text style={styles.proximosSmallTextMarginTop10}>Data: Segunda, 12 de Junho de 2025.</Text>
              <Text style={styles.proximosSmallTextMarginTop1}>Horário: 9:30 ‑ 10:00.</Text>
              <Text style={styles.proximosSmallTextMarginTop1}>Doutor(a): Silvana Pães.</Text>
              
              <TouchableOpacity style={styles.cancel} 
                onPress={() => navigation.navigate('CancelarConsulta')}
              >
                <Text style={styles.proximosCancelText}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        )}

        {consultasFiltradas.length === 0 && (
          <Text style={styles.noConsultasText}>Nenhuma consulta nesta aba.</Text>
        )}

          {consultasFiltradas.map(consulta => {
            const icon = consulta.tipo === 'Empresa' ? EmpresaIcon : ClinicaIcon;
            return (
              <View key={consulta.id} style={styles.whitebox}>
                <Image source={icon} 
                  style={styles.iconewhite} 
                />

                <View style={styles.contentBox}>
                  <View style={styles.rowSpaceBetween}>
                    <Text style={styles.titleText}>
                      Consulta - {consulta.tipo}
                    </Text>

                    {aba === 'concluidos' && (
                      consulta.statusAvaliacao !== 'avaliado' ? (
                        <TouchableOpacity style={styles.avaliarContainer}
                          onPress={() => navigation.navigate('Avaliar', { id: consulta.id })} 
                        >
                          <Image source={LapisIcon} 
                            style={styles.lapisIcon} 
                          />
                          <Text style={styles.avaliarText}>
                            Avaliar
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={[styles.avaliarText, styles.avaliadoText]}>
                          Avaliado
                        </Text>
                      )
                    )}
                  </View>

                  <View style={styles.separator} />

                  <View style={styles.rowCentered}>
                    <Text style={styles.labelText}>
                      {consulta.tipo === 'Clínica' ? 'Clínica:' : 'Empresa:'}
                    </Text>
                    <Text style={styles.normalText}> {consulta.nome}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.labelText}>
                      Endereço:
                    </Text>
                    <Text style={styles.addressText}> {consulta.endereco}</Text>
                  </View>

                  {detalhesVisiveis[consulta.id] && (
                    <View style={styles.detalhesContainer}>
                      <View style={styles.rowCentered}>
                        <Text style={styles.smallLabelTextData}>
                          Data:
                        </Text>
                        <Text style={styles.smallNormalText2}> {consulta.data}</Text>
                      </View>

                      <View style={styles.rowCentered}>
                        <Text style={styles.smallLabelText}>
                          Horário:
                        </Text>
                        <Text style={styles.smallNormalText}> {consulta.horario}</Text>
                      </View>

                      <View style={styles.rowCentered}>
                        <Text style={styles.smallLabelText}>
                          Doutor(a):
                        </Text>
                        <Text style={styles.smallNormalText}> {consulta.doutor}</Text>
                      </View>
                    </View>
                  )}
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.verdepequeno}
                      onPress={() => toggleDetalhes(consulta.id)} 
                    >
                      <Text style={styles.textopequeno}>
                        {detalhesVisiveis[consulta.id] ? 'Ocultar Detalhes' : 'Saiba Mais'}
                      </Text>
                    </TouchableOpacity>

                    {aba === 'proximos' && (
                      <TouchableOpacity style={styles.brancopequeno}
                        onPress={() => navigation.navigate('CancelarConsulta', { id: consulta.id })}
                      >
                        <Text style={styles.textopequeno2}>
                          Cancelar
                        </Text>
                      </TouchableOpacity>
                    )}
                    
                    {aba === 'cancelados' && (
                      <TouchableOpacity style={styles.brancopequeno}
                        onPress={() => navigation.navigate('ReagendarConsulta', { id: consulta.id })} 
                      >
                        <Text style={styles.textopequeno2}>
                          Re-agendar
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f1f0ec',
    marginBottom: 20,
  },
  trapezio: {
    width: 82,
    height: 7,
    backgroundColor: '#6d8b89', 
    alignSelf: 'center',
    marginTop: 6,
    transform: [{ scaleX: 1.6 }],
    borderTopLeftRadius: 95,
    borderTopRightRadius: 95,
    borderBottomLeftRadius: -10,
    borderBottomRightRadius: -10,
  },
  headerContainer: {
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    zIndex: 10,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  cartButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  cartIcon: {
    width: 28,
    height: 28,
  },
  tabs: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    elevation: 2 
  },
  tab: { 
    flex: 1, 
    alignItems: 'center', 
    paddingTop: 18 
  },
  tabText: { 
    color: '#737373', 
    fontWeight: '600', 
    fontSize: 18 
  },
  content: { 
    flex: 1,
    paddingHorizontal: 5, 
    paddingTop: 12 
  },
  banner: { 
    width: '106%', 
    height: 310,
    marginBottom: 10,
  },
  proximosHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  proximosMinhasText: { 
    color: 'white', 
    fontSize: 25, 
    fontWeight: 'bold' 
  },
  proximosConsultasText: { 
    fontSize: 25, 
    marginRight: 3, 
    fontWeight: 'bold' 
  },
  boxverde: {
    backgroundColor: '#a5c3a7',
    paddingVertical: 14,
    paddingHorizontal: 10,
    width: '80%',
    alignSelf: 'center',
    marginTop: 35,
    borderWidth: 2,
    borderColor: '#1c404b',
    position: 'relative',
    minHeight: 200,
    justifyContent: 'space-between',
  },
  next: {
    backgroundColor: '#44615f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 30,
    width: '90%',
    marginTop: -30,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#1c404b',
  },
  calendarIcon: { 
    width: 25, 
    height: 25, 
    marginHorizontal: 8, 
    resizeMode: 'contain' 
  },
  proximosNextText: { 
    color: 'white', 
    fontSize: 18 
  },
  proximosConsultaClinicaText: { 
    fontSize: 18, 
    color: '#1c404b', 
    fontWeight: '600', 
    marginTop: 5 
  },
  proximosSmallTextMarginTop3: { 
    fontSize: 18, 
    marginTop: 3 
  },
  proximosSmallTextMarginTop1: { 
    fontSize: 18 
  },
  proximosSmallTextMarginTop10: { 
    fontSize: 18 
  },
  proximosCancelText: { 
    fontSize: 18, 
    color: 'white', 
    textAlign: 'center' 
  },
  cancel: {
    backgroundColor: '#44615f',
    padding: 10,
    width: 110,
    borderRadius: 100,
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 10,
  },
  noConsultasText: { 
    textAlign: 'center',
    marginTop: 20, 
    fontSize: 16,
    color: '#666' 
  },
  whitebox: { 
    backgroundColor: 'white',  
    marginHorizontal: 5, 
    borderRadius: 20, 
    padding: 18,
    flexDirection: 'row',
    marginBottom: 10
  },
  iconewhite: { 
    height: 60, 
    width: 60, 
    borderRadius: 5 
  },
  contentBox: { 
    marginLeft: 20,
    flex: 1, 
    justifyContent: 'space-between' 
  },
  rowSpaceBetween: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  rowCentered: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flexWrap: 'wrap',
  },
  row: { 
    flexDirection: 'row', 
    marginBottom: 10, 
    flexWrap: 'wrap' 
  },
  detalhesContainer: { 
    marginTop: 20 
  },
  verdepequeno: { 
    backgroundColor: '#47667b', 
    borderRadius: 100, 
    paddingVertical: 10, 
    paddingHorizontal: 25, 
    borderWidth: 3, 
    borderColor: '#47667b', 
    minWidth: 80,
    alignItems: 'center', 
    justifyContent: 'center', 
    marginLeft: 12 
  },
  textopequeno: { 
    color: 'white', 
    fontSize: 14, 
    textAlign: 'center' 
  },
  brancopequeno: { 
    borderWidth: 3, 
    borderColor: '#b1adad', 
    paddingVertical: 10, 
    paddingHorizontal: 25, 
    borderRadius: 100, 
    marginLeft: 12, 
    minWidth: 80, 
    justifyContent: 'center',
    alignItems: 'center' 
  },
  titleText: { 
    fontSize: 25, 
    color: '#44615f', 
    fontWeight: '700', 
    flexShrink: 1 
  },
  labelText: { 
    fontSize: 18, 
    color: '#6d8b89', 
    flexShrink: 1 
  },
  normalText: { 
    fontSize: 18, 
    flexShrink: 1 
  },
  addressText: { 
    fontSize: 18, 
    flexShrink: 1, 
    flexWrap: 'wrap', 
    width: '65%' 
  },
  smallLabelText: { 
    fontSize: 18, 
    color: '#6d8b89', 
    flexShrink: 1 
  },
  smallNormalText: { 
    fontSize: 18, 
    flexShrink: 1 
  },
  smallLabelTextData: { 
    fontSize: 18, 
    color: '#6d8b89', 
    flexShrink: 1 
  },
  smallNormalText2: { 
    fontSize: 18, 
    flexShrink: 1 
  },
  avaliarContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  lapisIcon: { 
    width: 20, 
    height: 20, 
    marginRight: 6 
  },
  avaliarText: { 
    fontSize: 19, 
    color: '#a5c3a7' 
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  activeTabText: { 
    color: '#6d8b89',
    fontWeight: 'bold',
    fontSize: 18
  },
  textopequeno2: {
    color: '#737373',
    fontSize: 14,
    textAlign: 'center',
  },
  avaliadoText: {
    fontWeight: 'bold',
    fontSize: 19,
    color: '#a5c3a7',
  },
  separator: {
    height: 3,
    width: '100%',
    backgroundColor: '#f1f0ec',
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 100,
  },
});
