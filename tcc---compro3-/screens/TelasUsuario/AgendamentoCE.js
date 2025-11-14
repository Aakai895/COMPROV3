import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView,
  ActivityIndicator, TouchableOpacity, Dimensions, 
  Platform, FlatList, Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getClinicImageById, getImagemEspecialidade } from '../imagensProdutos';
import { auth, db } from '../../firebaseServices/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

export default function DetalhesClinica() {
  const route = useRoute();
  const navigation = useNavigation();

  const { clinicId, especialidadesSelecionadas } = route.params || {};
  const id = clinicId;

  console.log("ID recebido via rota:", id);
  console.log("Especialidades selecionadas:", especialidadesSelecionadas);

  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agendando, setAgendando] = useState(false);

  const [dias, setDias] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selecionados, setSelecionados] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Monitorar usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (Array.isArray(especialidadesSelecionadas)) {
      setSelecionados([...especialidadesSelecionadas]);
    }
  }, [especialidadesSelecionadas]);

  const toggleSelecionada = (item) => {
    setSelecionados(prev => {
      if (prev.includes(item)) {
        return prev.filter(i => i !== item); 
      } else {
        return [...prev, item];
      }
    });
  };
  
  const renderEspecialidadeItem = ({ item }) => {
    const isSelected = selecionados.includes(item);

    return (
      <TouchableOpacity
        style={[
          styles.cardEspecialidade,
          isSelected && { borderColor: '#000', borderWidth: 3 }
        ]}
        onPress={() => toggleSelecionada(item)}
        activeOpacity={0.8}
      >
        <Image
          source={getImagemEspecialidade(item)}
          style={styles.especialidadeImage}
          resizeMode="cover"
        />
        <View style={styles.nomeContainer}>
          <Image
            source={
              isSelected
                ? require('../../assets/icones/EspecialidadeAdd.png')
                : require('../../assets/icones/addEspecialidade.png')
            }
            style={styles.iconImage}
            resizeMode="contain"
          />
          <Text style={styles.especialidadeNome}>{item}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const especialidadesOrdenadas = [
    ...selecionados,
    ...(clinic?.especialidades?.filter(e => !selecionados.includes(e)) || [])
  ];

  useEffect(() => {
      async function fetchClinic() {
        setLoading(true);
        try {
          const res = await fetch('https://compro-2-sandy.vercel.app/');
          const text = await res.text();

          let data;
          try {
            data = JSON.parse(text);
          } catch (err) {
            try {
              data = eval(text);
            } catch (err2) {
              console.error('Não foi possível parsear o retorno da API', err2);
              data = [];
            }
          }

        const found = Array.isArray(data) ? data.find(item => item.id === id) : null;

        if (found) {
          const mapped = {
            id: found.id,
            name: found.nome || found.name,
            avaliacao: found.Avaliacao ?? found.avaliacao ?? 0,
            especialidades: found.especialidades || [],
            addressObj: found.Endereco || found.address || {},
            horarioAtendimento: found.horarioAtendimento || { início: '08:00', fim: '18:00' },
            intervaloTempoAgendamento: found.intervaloTempoAgendamento || 30,
            image: getClinicImageById ? getClinicImageById(found.id) : null,
          };
          setClinic(mapped);
        } else {
          console.log(`Nenhuma clínica encontrada com o ID: ${id}`);
          setClinic(null);
        }
      } catch (error) {
        console.error('Erro ao buscar dados da clínica:', error);
        setClinic(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchClinic();
    } else {
      setLoading(false);
      setClinic(null);
    }
  }, [id]);

  function gerarDias() {
    const hoje = new Date();
    const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    const lista = [];

    for (let i = 0; i < 7; i++) {
      const data = new Date();
      data.setDate(hoje.getDate() + i);

      lista.push({
        label: i === 0 ? 'Hoje' : nomesDias[data.getDay()],
        dia: data.getDate(),
        mes: meses[data.getMonth()],
        completo: data.toISOString().split('T')[0],
        dataObj: data
      });
    }

    return lista;
  }

  function gerarHorarios(inicio, fim, intervalo) {
    const horariosGerados = [];

    const [hIni, mIni] = inicio.split(':').map(Number);
    const [hFim, mFim] = fim.split(':').map(Number);

    let inicioMin = hIni * 60 + mIni;
    const fimMin = hFim * 60 + mFim;

    while (inicioMin <= fimMin) {
      const h = String(Math.floor(inicioMin / 60)).padStart(2, '0');
      const m = String(inicioMin % 60).padStart(2, '0');
      horariosGerados.push(`${h}:${m}`);
      inicioMin += intervalo;
    }

    return horariosGerados;
  }

  useEffect(() => {
    if (!clinic) return;

    const diasGerados = gerarDias();
    setDias(diasGerados);
    setDiaSelecionado(diasGerados[0]);

    const horariosGerados = gerarHorarios(
      clinic.horarioAtendimento?.início || '08:00',
      clinic.horarioAtendimento?.fim || '18:00',
      clinic.intervaloTempoAgendamento || 30
    );
    setHorarios(horariosGerados);
  }, [clinic]);

  // Função para validar campos
  const validarCampos = () => {
    if (!currentUser) {
      Alert.alert('Erro', 'Você precisa estar logado para agendar uma consulta.');
      return false;
    }

    if (!diaSelecionado) {
      Alert.alert('Atenção', 'Por favor, selecione um dia para a consulta.');
      return false;
    }

    if (!horarioSelecionado) {
      Alert.alert('Atenção', 'Por favor, selecione um horário para a consulta.');
      return false;
    }

    if (selecionados.length === 0) {
      Alert.alert('Atenção', 'Por favor, selecione pelo menos uma especialidade.');
      return false;
    }

    return true;
  };

  // Função para agendar consulta no Firebase
  const agendarConsulta = async () => {
    if (!validarCampos()) return;

    setAgendando(true);

    try {
      // Criar objeto da consulta
      const consultaData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        clinicId: clinic.id,
        clinicName: clinic.name,
        especialidades: selecionados,
        data: diaSelecionado.completo,
        dataObj: diaSelecionado.dataObj,
        horario: horarioSelecionado,
        endereco: `${clinic.addressObj.ruaAvenidaPraca || ''}, ${clinic.addressObj.numero || ''} - ${clinic.addressObj.bairro || ''}`,
        status: 'agendada',
        criadoEm: serverTimestamp(),
        tipo: 'Clínica'
      };

      // Salvar no Firestore
      const docRef = await addDoc(collection(db, 'consultas'), consultaData);
      
      console.log('Consulta agendada com ID:', docRef.id);
      
      // Mostrar mensagem de sucesso
      Alert.alert(
        'Sucesso!', 
        'Consulta agendada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navegar de volta ou para minhas consultas
              navigation.navigate('MinhasConsultas');
            }
          }
        ]
      );

    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
      Alert.alert('Erro', 'Não foi possível agendar a consulta. Tente novamente.');
    } finally {
      setAgendando(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const data = selectedDate;
      const customDay = {
        label: nomesDias[data.getDay()],
        dia: data.getDate(),
        mes: meses[data.getMonth()],
        completo: data.toISOString().split('T')[0],
        dataObj: data
      };
      setDiaSelecionado(customDay);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1c404b" />
        <Text style={{ marginTop: 8 }}>Carregando informações...</Text>
      </View>
    );
  }

  if (!clinic) {
    return (
      <View style={styles.center}>
        <Text>Clínica não encontrada.</Text>
      </View>
    );
  }

  const { name, especialidades, addressObj, image } = clinic;
  const addressText = `${addressObj.ruaAvenidaPraca || ''}, ${addressObj.numero || ''} - ${addressObj.bairro || ''}`;

  return (
    <View style={styles.screen}>
      <View style={styles.headerContainer}>
        <Image
          source={image}
          style={styles.mainImage}
        />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <View style={styles.avaliacaoTrapezio}>
            <View style={styles.starsContainer}>
              <Text style={styles.textAgendamento}>Agendamento</Text>
            </View>
          </View>

          <View style={styles.headerInfoRow}>
            <Text style={styles.name}>{name}</Text>
          </View>

          <Text style={styles.especialidadesText}>
            {especialidades.join(', ')}
          </Text>

          <View style={styles.divider} />

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Image source={require('../../assets/icones/location2Icon.jpg')} style={styles.smallIcon} />
              <Text style={styles.infoText}>{addressText}</Text>
            </View>
            
            <Text style={styles.textAgendamento2}>Agendamento</Text>
          </View>

          <View style={styles.agendamentoContent}>
            <View style={{paddingHorizontal: 16}}>
              <Text style={styles.textDia}>Dia{diaSelecionado && <Text style={styles.required}> *</Text>}</Text>

              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={{ marginVertical: 10 }}
                contentContainerStyle={styles.horizontalScroll}
              >
                {dias.map((item, index) => {
                  const selecionado = diaSelecionado?.completo === item.completo;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setDiaSelecionado(item)}
                      style={[styles.cardDia, selecionado && styles.cardDiaSelecionado]}
                    >
                      <Text style={[styles.textDiaLabel, selecionado && styles.textSelecionado]}>{item.label}</Text>
                      <Text style={[styles.textDiaData, selecionado && styles.textSelecionado]}>
                        {item.dia} {item.mes}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                <TouchableOpacity style={styles.cardDiaEspecial} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.textDiaLabel2}>Selecionar Data</Text>
                </TouchableOpacity>
              </ScrollView>

              <Text style={{ marginTop: 20, fontSize: 20 }}>
                Horário{horarioSelecionado && <Text style={styles.required}> *</Text>}
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={{ marginVertical: 10 }}
                contentContainerStyle={styles.horizontalScroll}
              >
                {horarios.map((h, index) => {
                  const selecionado = horarioSelecionado === h;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setHorarioSelecionado(h)}
                      style={[styles.cardHorario, selecionado && styles.cardHorarioSelecionado]}
                    >
                      <Text style={[styles.textHorario, selecionado && styles.textHorarioSelecionado]}>{h}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {showDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={new Date()}
                  onChange={onDateChange}
                />
              )}
            </View>

            <View style={styles.especialidadesSection}>
              <View style={styles.especialidadesHeader}>
                <Text style={styles.h2}>
                  Especialidades{selecionados.length > 0 && <Text style={styles.required}> *</Text>}
                </Text>
                <Text style={styles.count}>({especialidades.length})</Text>
              </View>

              <Text style={styles.selecionadasText}>
                {selecionados.length > 0 
                  ? `${selecionados.length} especialidade(s) selecionada(s)` 
                  : 'Nenhuma especialidade selecionada'}
              </Text>

              <FlatList
                data={especialidadesOrdenadas}
                renderItem={renderEspecialidadeItem}
                keyExtractor={(item, idx) => `${item}-${idx}`}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                scrollEnabled={false}
              />
            </View>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.agendarContainer}>
        <TouchableOpacity 
          style={[
            styles.agendarButton, 
            (!diaSelecionado || !horarioSelecionado || selecionados.length === 0) && styles.agendarButtonDisabled
          ]} 
          onPress={agendarConsulta}
          disabled={agendando || !diaSelecionado || !horarioSelecionado || selecionados.length === 0}
        >
          {agendando ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.agendarText}>
              {!diaSelecionado || !horarioSelecionado || selecionados.length === 0 
                ? 'Preencha todos os campos' 
                : 'Agendar Consulta'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelarButton} onPress={() => navigation.navigate('VisualizarCE', { id: clinic.id })}>
          <Text style={styles.cancelarText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { 
    flex: 1,
    backgroundColor: '#fff'
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  spacer: {
    height: 100,
  },
  agendamentoContent: {
    flex: 1,
  },
  horizontalScroll: {
    paddingRight: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -27,
    flex: 1,
  },
  divider: {
    height: 1.5,
    backgroundColor: '#d9d9d9',
    marginHorizontal: 16,
  },
  headerContainer: {
    position: 'relative',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 4,
    marginTop: 25
  },
  mainImage: {
    width: '100%',
    height: 250,
  },
  especialidadesText:{
    fontSize: 18, 
    marginHorizontal: 16,
    marginTop: 5,
    color: '#1c404b',
    marginBottom: 20
  },
  starsContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#47667b',
    paddingVertical: 8,
    paddingHorizontal: 50,
    borderBlockColor: '#000',
    borderRadius: 10,
    borderWidth: 2.5,
  },
  textAgendamento: {
    fontSize: 22,
    color: '#fff'
  },
  textAgendamento2: {
    color: '#737373',
    fontSize: 20,
    marginTop: 15,
  },
  textDia: {
    fontSize: 22,
  },
  avaliacaoTrapezio: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginTop: 8,
  },
  infoCard: {
    borderRadius: 15,
    padding: 12,
    marginTop: 10
  },
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 8 
  },
  smallIcon: { 
    width: 25, 
    height: 25, 
    marginRight: 10, 
    marginTop: 2,
  },
  infoText: { 
    flex: 1, 
    fontSize: 18, 
    color: '#000' 
  },
  cardEspecialidade: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: (width / 2) - 12, 
    height: (width / 2) - 12, 
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#d9d9d9',
    alignItems: 'center',
    overflow: 'hidden', 
  },
  especialidadeImage: {
    width: '100%',
    height: '75%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    resizeMode: 'cover',
  },
  nomeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 8, 
    paddingHorizontal: 6
  },
  iconImage: {
    width: 30,
    height: 30,
    marginRight: 6,
  },
  especialidadeNome: {
    fontSize: 18,
    flexShrink: 1,
    color: "#000",
  },
  agendarContainer: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  agendarButton: {
    width: '100%',
    backgroundColor: '#799689',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3,
  },
  agendarButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  agendarText: { 
    color: '#fff', 
    fontSize: 17, 
    fontWeight: '700' 
  },
  cardDia: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    alignItems: 'center',
  },
  cardDiaSelecionado: {
    backgroundColor: '#47667b',
    borderColor: '#47667b',
  },
  textDiaLabel: {
    fontSize: 14,
    color: '#000',
  },
  textDiaLabel2: {
    fontSize: 16,
    color: '#000',
  },
  textDiaData: {
    fontSize: 20,
    color: '#6d6d6d',
  },
  textSelecionado: {
    color: '#fff',
  },
  cardDiaEspecial: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#bbb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardHorario: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  cardHorarioSelecionado: {
    backgroundColor: '#47667b',
    borderColor: '#47667b',
  },
  textHorario: {
    fontSize: 20,
    color: '#6d6d6d',
  },
  textHorarioSelecionado: {
    color: '#fff',
  },
  especialidadesSection: {
    marginTop: 20,
  },
  especialidadesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  h2: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#0d253c' 
  },
  count: { 
    marginLeft: 8, 
    color: '#6d8b89', 
    fontSize: 18,
    fontWeight: '700', 
  },
  columnWrapper: { 
    justifyContent: 'space-between', 
    paddingHorizontal: 6 
  },
  cancelarButton: {
    width: '100%',
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 2,
    elevation: 3,
  },
  cancelarText: {
    color: '#000',
    fontSize: 17,
  },
  required: {
    color: 'red',
  },
  selecionadasText: {
    fontSize: 16,
    color: '#6d8b89',
    marginLeft: 16,
    marginBottom: 10,
    fontStyle: 'italic',
  },
});