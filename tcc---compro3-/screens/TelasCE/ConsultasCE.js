import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  Image, ScrollView, Dimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const ClinicaIcon = require('../../assets/icones/ClinicaIcon.png');
const EmpresaIcon = require('../../assets/icones/EmpresaIcon.png');
const LapisIcon = require('../../assets/icones/lapisIcon.png');

export default function MinhasConsultas() {
  const navigation = useNavigation();
  const [aba, setAba] = useState('proximos');
  const [detalhesVisiveis, setDetalhesVisiveis] = useState({});

  const todasConsultas = [
    {
      id: '1',
      tipo: 'Clínica',
      nome: 'Alvaro Mendes',
      data: '30 de agosto',
      horario: '8:30 ás 9:15',
      doutor: 'Fabio',
      
    },
    {
      id: '2',
      tipo: 'Clínica',
      nome: 'Alvaro Mendes',
      data: '30 de agosto',
      horario: '8:30 ás 9:15',
      doutor: 'Fabio',
    },
    {
      id: '3',
      tipo: 'Clínica',
      nome: 'Alvaro Mendes',
      data: '30 de agosto',
      horario: '8:30 ás 9:15',
      doutor: 'Fabio',
    },
    {
      id: '5',
      tipo: 'Clínica',
      nome: 'Alvaro Mendes',
      data: '30 de agosto',
      horario: '8:30 ás 9:15',
      doutor: 'Fabio',
    },
  ];

  const toggleDetalhes = (consultaId) => {
    setDetalhesVisiveis(prev => ({ ...prev, [consultaId]: !prev[consultaId] }));
  };

  const consultasFiltradas = todasConsultas.filter(c => c.status === aba);

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setAba('proximos')} style={styles.tab}>
          <Text style={[styles.tabText, aba === 'proximos' && styles.activeTabText]}>
            Todos
          </Text>
          {aba === 'proximos' && 
          <View style={styles.trapezio} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setAba('concluidos')} style={styles.tab}>
          <Text style={[styles.tabText, aba === 'concluidos' && styles.activeTabText]}>
            Especialidades
          </Text>
          {aba === 'concluidos' && 
          <View style={styles.trapezio} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setAba('cancelados')} style={styles.tab}>
          <Text style={[styles.tabText, aba === 'cancelados' && styles.activeTabText]}>
            Doutor(a)
          </Text>
          {aba === 'cancelados' && 
          <View style={styles.trapezio} />}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
        
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
                      Data: {consulta.data} - {consulta.horario}
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
                      {consulta.tipo === 'Clínica' ? 'Doutor(a):' : 'Doutor(a):'}
                    </Text>
                    <Text style={styles.normalText}> {consulta.doutor}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.labelText}>
                      Paciente:
                    </Text>
                    <Text style={styles.addressText}> {consulta.nome}</Text>
                  </View>

                  {detalhesVisiveis[consulta.id] && (
                    <View style={styles.detalhesContainer}>
                      <View style={styles.rowCentered}>
                        <Text style={styles.smallLabelTextData}>
                          Especialidades:
                        </Text>
                        <Text style={styles.smallNormalText2}> {consulta.data}</Text>
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
