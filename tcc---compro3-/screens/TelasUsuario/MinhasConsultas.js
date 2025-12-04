import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  Image, ScrollView, Dimensions, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../firebaseServices/firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const ClinicaIcon = require('../../assets/icones/ClinicaIcon.png');
const EmpresaIcon = require('../../assets/icones/EmpresaIcon.png');
const LapisIcon = require('../../assets/icones/lapisIcon.png');

export default function MinhasConsultas() {
  const navigation = useNavigation();
  const [aba, setAba] = useState('proximos');
  const [detalhesVisiveis, setDetalhesVisiveis] = useState({});
  const [consultas, setConsultas] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setConsultas([]);
      }
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'consultas'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const consultasData = [];
      querySnapshot.forEach((doc) => {
        consultasData.push({ id: doc.id, ...doc.data() });
      });
      
      consultasData.sort((a, b) => new Date(a.data) - new Date(b.data));
      
      consultasData.forEach(consulta => {
        verificarEAtualizarStatus(consulta);
      });
      
      setConsultas(consultasData);
    });

    return unsubscribe;
  }, [userId]);

  const verificarEAtualizarStatus = async (consulta) => {
    try {
      if (consulta.status !== 'agendada') return;
      
      const hoje = new Date();
      const dataConsulta = new Date(consulta.data);
        if (dataConsulta < hoje) {
        const consultaRef = doc(db, 'consultas', consulta.id);
        await updateDoc(consultaRef, {
          status: 'concluida',
          dataConclusao: new Date().toISOString()
        });
        console.log(`Consulta ${consulta.id} marcada como concluída automaticamente`);
      }
    } catch (error) {
      console.error('Erro ao atualizar status da consulta:', error);
    }
  };

  const toggleDetalhes = (consultaId) => {
    setDetalhesVisiveis(prev => ({ ...prev, [consultaId]: !prev[consultaId] }));
  };

  const cancelarConsulta = async (consultaId) => {
    try {
      const consultaRef = doc(db, 'consultas', consultaId);
      await updateDoc(consultaRef, {
        status: 'cancelada',
        dataCancelamento: new Date().toISOString()
      });
      Alert.alert('Sucesso', 'Consulta cancelada com sucesso!');
    } catch (error) {
      console.error('Erro ao cancelar consulta:', error);
      Alert.alert('Erro', 'Não foi possível cancelar a consulta.');
    }
  };

  const confirmarCancelamento = (consultaId) => {
    Alert.alert(
      'Cancelar Consulta',
      'Tem certeza que deseja cancelar esta consulta?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => cancelarConsulta(consultaId) }
      ]
    );
  };

  const consultasFiltradas = consultas.filter(consulta => {
    if (aba === 'proximos') {
      return consulta.status === 'agendada';
    } else if (aba === 'concluidos') {
      return consulta.status === 'concluida';
    } else if (aba === 'cancelados') {
      return consulta.status === 'cancelada';
    }
    return false;
  });

  const formatarData = (dataString) => {
    if (!dataString) return 'Data não definida';
    
    try {
      const data = new Date(dataString);
      if (isNaN(data.getTime())) {
        return 'Data inválida';
      }
      
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return data.toLocaleDateString('pt-BR', options);
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  const proximaConsulta = consultasFiltradas
    .filter(consulta => consulta.status === 'agendada')
    .sort((a, b) => new Date(a.data) - new Date(b.data))[0];

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
          {aba === 'proximos' && proximaConsulta && (
            <View style={styles.bannerContainer}>
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
                  <Text style={styles.proximosConsultaClinicaText}>
                    Consulta - {proximaConsulta.tipo || 'Clínica'}
                  </Text>
                  <Text style={styles.proximosSmallTextMarginTop3}>
                    {(proximaConsulta.tipo === 'Clínica' ? 'Clínica:' : 'Empresa:')} {proximaConsulta.clinicName || 'Nome não disponível'}
                  </Text>
                  <Text style={styles.proximosSmallTextMarginTop1}>
                    Endereço: {proximaConsulta.endereco || 'Endereço não disponível'}
                  </Text>
                  <Text style={styles.proximosSmallTextMarginTop10}>
                    Data: {formatarData(proximaConsulta.data)}
                  </Text>
                  <Text style={styles.proximosSmallTextMarginTop1}>
                    Horário: {proximaConsulta.horario || 'Horário não disponível'}
                  </Text>
                  <Text style={styles.proximosSmallTextMarginTop1}>
                    Especialidades: {proximaConsulta.especialidades?.join(', ') || 'Nenhuma especialidade'}
                  </Text>
                  
                  <TouchableOpacity style={styles.cancel} 
                    onPress={() => confirmarCancelamento(proximaConsulta.id)}
                  >
                    <Text style={styles.proximosCancelText}>
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          )}

          {aba === 'proximos' && !proximaConsulta && consultasFiltradas.length === 0 && (
            <View style={styles.bannerContainer}>
              <ImageBackground source={require('../../assets/Plano_Fundo/Banner.png')} style={styles.banner}>
                <View style={styles.proximosHeaderContainer}>
                  <Text style={styles.proximosMinhasText}>Minhas</Text>
                  <Text style={styles.proximosConsultasText}> Consultas</Text>
                </View>
                <View style={styles.boxverde}>
                  <Text style={styles.noConsultasText}>
                    Nenhuma consulta agendada
                  </Text>
                </View>
              </ImageBackground>
            </View>
          )}

          {/* Container separado para as consultas listadas */}
          <View style={styles.consultasListContainer}>
            {consultasFiltradas.length === 0 && aba !== 'proximos' && (
              <View style={styles.noConsultasContainer}>
                <Text style={styles.noConsultasText}>Nenhuma consulta {aba}</Text>
              </View>
            )}

            {consultasFiltradas.map(consulta => {
              const icon = (consulta.tipo === 'Empresa') ? EmpresaIcon : ClinicaIcon;
              
              return (
                <View key={consulta.id} style={styles.whitebox}>
                  <Image source={icon} 
                    style={styles.iconewhite} 
                  />

                  <View style={styles.contentBox}>
                    <View style={styles.rowSpaceBetween}>
                      <Text style={styles.titleText}>
                        Consulta - {consulta.tipo || 'Clínica'}
                      </Text>

                      {aba === 'concluidos' && (
                        consulta.avaliado ? (
                          <Text style={[styles.avaliarText, styles.avaliadoText]}>
                            Avaliado
                          </Text>
                        ) : (
                          <TouchableOpacity style={styles.avaliarContainer}
                            onPress={() => navigation.navigate('AvaliarCE', { 
                              consultaId: consulta.id,
                              clinicId: consulta.clinicId,
                              clinicName: consulta.clinicName
                            })} 
                          >
                            <Image source={LapisIcon} 
                              style={styles.lapisIcon} 
                            />
                            <Text style={styles.avaliarText}>
                              Avaliar
                            </Text>
                          </TouchableOpacity>
                        )
                      )}
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.rowCentered}>
                      <Text style={styles.labelText}>
                        {(consulta.tipo === 'Clínica' ? 'Clínica:' : 'Empresa:')}
                      </Text>
                      <Text style={styles.normalText}> {consulta.clinicName || 'Nome não disponível'}</Text>
                    </View>

                    <View style={styles.row}>
                      <Text style={styles.labelText}>
                        Endereço:
                      </Text>
                      <Text style={styles.addressText}> {consulta.endereco || 'Endereço não disponível'}</Text>
                    </View>

                    {detalhesVisiveis[consulta.id] && (
                      <View style={styles.detalhesContainer}>
                        <View style={styles.rowCentered}>
                          <Text style={styles.smallLabelTextData}>
                            Data:
                          </Text>
                          <Text style={styles.smallNormalText2}> {formatarData(consulta.data)}</Text>
                        </View>

                        <View style={styles.rowCentered}>
                          <Text style={styles.smallLabelText}>
                            Horário:
                          </Text>
                          <Text style={styles.smallNormalText}> {consulta.horario || 'Horário não disponível'}</Text>
                        </View>

                        <View style={styles.rowCentered}>
                          <Text style={styles.smallLabelText}>
                            Especialidades:
                          </Text>
                          <Text style={styles.smallNormalText}> {consulta.especialidades?.join(', ') || 'Nenhuma especialidade'}</Text>
                        </View>

                        {consulta.dataCancelamento && (
                          <View style={styles.rowCentered}>
                            <Text style={styles.smallLabelText}>
                              Cancelada em:
                            </Text>
                            <Text style={styles.smallNormalText}> {formatarData(consulta.dataCancelamento)}</Text>
                          </View>
                        )}

                        {consulta.dataConclusao && (
                          <View style={styles.rowCentered}>
                            <Text style={styles.smallLabelText}>
                              Concluída em:
                            </Text>
                            <Text style={styles.smallNormalText}> {formatarData(consulta.dataConclusao)}</Text>
                          </View>
                        )}
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
                          onPress={() => confirmarCancelamento(consulta.id)}
                        >
                          <Text style={styles.textopequeno2}>
                            Cancelar
                          </Text>
                        </TouchableOpacity>
                      )}
                      
                      {aba === 'cancelados' && (
                        <TouchableOpacity style={styles.brancopequeno}
                          onPress={() => navigation.navigate('AgendamentoCE', { 
                            clinicId: consulta.clinicId,
                            especialidadesSelecionadas: consulta.especialidades 
                          })} 
                        >
                          <Text style={styles.textopequeno2}>
                            Reagendar
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
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
  bannerContainer: {
    marginBottom: 10, 
  },
  banner: { 
    width: '106%', 
    height: 310,
  },
  consultasListContainer: {
    marginTop: 10, 
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
  noConsultasContainer: {
    padding: 20,
    alignItems: 'center',
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