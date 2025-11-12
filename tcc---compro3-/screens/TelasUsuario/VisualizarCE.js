import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView,
  ActivityIndicator, TouchableOpacity, FlatList,
  Dimensions, TouchableWithoutFeedback, TextInput} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getClinicImageById } from '../imagensProdutos'; 
import { getImagemEspecialidade } from '../imagensProdutos'; 
const { width } = Dimensions.get('window');
import Svg, { Polygon, Rect, ClipPath, Defs } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function DetalhesClinica() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {}; 
  const widthTop = 300;   
  const widthBottom = 120; 
  const height = 70;   
  const radius = 12; 

  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('Especialidades');
  const [selecionados, setSelecionados] = useState([]);

  const [expandirTexto, setExpandirTexto] = useState(false);
  const [mostrarBotaoLeiaMais, setMostrarBotaoLeiaMais] = useState(false);
  const [textoExcedeu, setTextoExcedeu] = useState(false);

  const toggleTexto = () => setExpandirTexto(prev => !prev);

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
            numAvaliacao: found.numAvaliacao ?? found.numAvaliacao ?? (found.numAvaliacoes || 0) ,
            especialidades: found.especialidades || [],
            addressObj: found.Endereco || found.address || {},
            distancia: found.distancia || found.distance || {},
            diasAtendimento: found.diasAtendimento || found.days || [],
            horarioAtendimento: found.horarioAtendimento || found.horario || { início: '', fim: '' },
            Doutores: found.Doutores || found.professionals || {},
            publico: found.publico || [],
            sobreNos: found.sobreNos || found.sobre || '',
            contato: found.contato || {},
            image: getClinicImageById ? getClinicImageById(found.id) : null,
          };
          setClinic(mapped);
        } else {
          setClinic(null);
        }
      } catch (error) {
        console.error('Erro ao buscar dados da clínica:', error);
        setClinic(null);
      } finally {
        setLoading(false);
      }
    }

    fetchClinic();
  }, [id]);

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

  const {
    name,
    avaliacao,
    numAvaliacao,
    especialidades,
    addressObj,
    distancia,
    diasAtendimento,
    horarioAtendimento,
    Doutores,
    publico,
    sobreNos,
    contato,
    image,
  } = clinic;

  const addressText = `${addressObj.ruaAvenidaPraca || ''}, ${addressObj.numero || ''} - ${addressObj.bairro || ''}, ${addressObj.Cidade || ''}`;

  const startHour =
    horarioAtendimento &&
    (horarioAtendimento['início'] || horarioAtendimento.inicio || horarioAtendimento.start || '');
  const endHour =
    horarioAtendimento &&
    (horarioAtendimento.fim || horarioAtendimento['fim'] || horarioAtendimento.end || '');

  const hoursText = `${startHour}${startHour ? ' - ' : ''}${endHour}`;

  const toggleSelecionada = (item) => {
    setSelecionados(prev =>
      prev.includes(item)
        ? prev.filter(e => e !== item)
        : [...prev, item]
    );
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
          resizeMode="100%"
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

  const Star = ({ size = 30, fill = 1 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <ClipPath id="clip">
          <Rect x="0" y="0" width={24 * fill} height="24" />
        </ClipPath>
      </Defs>
      <Polygon
        points="12,2 15,10 23,10 17,14 19,22 12,17 5,22 7,14 1,10 9,10"
        fill="#bfbaba"
      />
      <Polygon
        points="12,2 15,10 23,10 17,14 19,22 12,17 5,22 7,14 1,10 9,10"
        fill="#fff"
        clipPath="url(#clip)"
      />
    </Svg>
  );

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      let fill = 0;
      if (i <= rating) fill = 1;
      else if (i - rating < 1) fill = rating - (i - 1); 
      stars.push(<Star key={i} size={30} fill={fill} />);
    }
    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
  };

  const horaDistancia = distancia?.hora ? `${distancia.hora} Hora` : '';
  const kmDistancia = distancia?.km ? `${distancia.km} km` : '';
  const dias = diasAtendimento && diasAtendimento.length 
    ? `${diasAtendimento[0]} - ${diasAtendimento[diasAtendimento.length - 1]}` 
    : '';
  const horarioInicio = horarioAtendimento['início'] || horarioAtendimento.inicio || horarioAtendimento['start'] || '';
  const horarioFim = horarioAtendimento.fim || horarioAtendimento['end'] || '';

  const infoText = [horaDistancia, kmDistancia, dias, horarioInicio, horarioFim]
    .filter(Boolean) 
    .join(' • ');

  const diasSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sabádo",
  ];

  const getHorarioDia = (diaIndex) => {
    const inicio =
      horarioAtendimento?.início ||
      horarioAtendimento?.inicio ||
      horarioAtendimento?.start ||
      "00:00";
    const fim =
      horarioAtendimento?.fim ||
      horarioAtendimento?.end ||
      "00:00";

    return `${inicio} - ${fim}`;
  };

  return (
    <View style={styles.screen}>
      <View style={ styles.headerContainer }>
         <Image
          source={image}
          style={styles.mainImage}
        />

        <TouchableWithoutFeedback onPress={() => navigation.navigate('TelasUsuario')}>
          <Image
            source={require('../../assets/icones/SetaVoltar.png')}
            style={styles.backArrow}
            resizeMode="contain"
          />
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.card}>
        <View style={styles.avaliacaoTrapezio}>
          <Image
            source={require('../../assets/Elementos_Complementares/FundoEstrela.png')}
            style={{ width: widthTop, height }}
            resizeMode="stretch"
          />

          <View style={[styles.starsContainer, { width: widthTop, height }]}>
            <View style={styles.ratingStarsContainer}>
              {renderStars(avaliacao)}
            </View>
          </View>
        </View>

        <View style={styles.headerInfoRow}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.numAvaliacaoText}>
             {`(${numAvaliacao >= 500 ? numAvaliacao + '+' : numAvaliacao} Avaliações)`}
          </Text>
        </View>

        <Text style={styles.especialidadesText}>
          {especialidades.join(', ')}
        </Text>

        <View style={styles.divider} />

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Image source={require('../../assets/icones/LocationBranco.png')} style={styles.smallIcon} />
            <Text style={styles.infoText}>{addressText}</Text>
          </View>

          <View style={styles.infoRow}>
            <Image source={require('../../assets/icones/Relogio.png')} style={styles.smallIcon} />
            <Text style={styles.infoText}>{infoText}</Text>
          </View>
        </View>

        <View style={styles.navTabs}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            {['Especialidades', 'Avaliacoes', 'SobreNos'].map(tab => (
              <TouchableOpacity
                key={tab}
                onPress={() => setAbaAtiva(tab)}
                style={[
                  styles.tabItem,
                  abaAtiva === tab && styles.activeTabItem
                ]}
              >
                <Text style={[styles.tabText, abaAtiva === tab && styles.activeTabText]}>
                  {tab === 'Avaliacoes' ? 'Avaliações' : tab === 'SobreNos' ? 'Contato/Sobre Nós' : 'Especialidades'}
                </Text>
                {abaAtiva === tab && <View style={styles.trapezio} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        <View> 
          <View style={styles.tabContent}>
            {abaAtiva === 'Especialidades' && (
              <View>
                <View style={styles.especialidadesHeader}>
                  <Text style={styles.h2}>Especialidades</Text>
                  <Text style={styles.count}>({especialidades.length})</Text>
                </View>

                <FlatList
                  data={especialidades}
                  renderItem={renderEspecialidadeItem}
                  keyExtractor={(item, idx) => `${item}-${idx}`}
                  numColumns={2}
                  columnWrapperStyle={styles.columnWrapper}
                  contentContainerStyle={{ paddingBottom: 10 }}
                />
              </View>
            )}

            {abaAtiva === 'Avaliacoes' && (
             <View style={styles.avaliacoesContainer}>

              <TouchableOpacity style={styles.btnAvaliar}
                onPress={() => navigation.navigate('AvaliarCE', {clinicId: clinic.id})}
              >
                <Image
                  source={require('../../assets/icones/lapisIcon.png')} 
                  style={styles.btnAvaliarIcon}
                />
                <Text style={styles.btnAvaliarText}>Avaliar</Text>
              </TouchableOpacity>

              <View style={styles.searchBox}>
                <Image
                  source={require("../../assets/icones/Lupa3Icon.jpg")}
                  style={styles.searchIcon}
                />
                <TextInput
                  placeholder="Procurar por avaliações"
                  style={styles.searchInput}
                  placeholderTextColor="#8A8A8A"
                />
              </View>

              <View style={styles.filtrosContainer}>
                <TouchableOpacity style={[styles.filtroBtn, styles.filtroTag]}>
                  <Image
                    source={require("../../assets/icones/Filtro2.jpg")}
                    style={styles.filtroIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.filtroTexto}>Filtro</Text>

                  <Image
                    source={require("../../assets/icones/setaBaixa.jpg")}
                    style={styles.setaIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.filtroTag, styles.tagAtivo]}>
                  <Text style={styles.tagTextoAtivo}>Recentes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.filtroTag}>
                  <Text style={styles.tagTexto}>Antigos</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.divider2} />

              <View style={styles.avaliacaoCard}>
                <Image
                  source={require("../../assets/Elementos_Complementares/user.jpg")}
                  style={styles.avatar}
                /> 

                <View style={{ flex: 1, marginLeft: 12 }}>

                  <View style={styles.nomeLinha}>
                    <Text style={styles.nomeUsuario}>Rainha do Som</Text>

                    <View style={styles.linhaAvaliacao}>
                      <View style={styles.linhaSuperior}>

                        <View style={styles.iconeNota}>
                          <Icon name="star" size={20} color="#FFD700" />
                          <Text style={styles.ratingBold}>5.0</Text>
                        </View>
                      </View>

                      <Text style={styles.tempo}>8 horas atrás</Text>
                    </View>
                  </View>

                  <Text style={styles.textoAvaliacao}>
                    AMEI!!!! pedi para adicionarem uma caixinha de som embutida. MUITO BOAAA. 
                    funciona perfeitamente e não ocorreu nenhum problema.
                  </Text>
                </View>
              </View>

            </View>

            )}

            {abaAtiva === 'SobreNos' && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Sobre Nós</Text>

                <Text
                  style={styles.sectionText}
                  numberOfLines={expandirTexto ? undefined : 4}
                  onTextLayout={(e) => {
                    if (!textoExcedeu) {
                      const { lines } = e.nativeEvent;
                      if (lines.length >= 4) {
                        setMostrarBotaoLeiaMais(true);
                        setTextoExcedeu(true);
                      }
                    }
                  }}
                >
                  {sobreNos}
                </Text>

                {mostrarBotaoLeiaMais && (
                  <TouchableOpacity onPress={toggleTexto}>
                    <Text style={styles.leiaMaisBtn}>
                      {expandirTexto ? 'Ver menos' : 'Leia mais'}
                    </Text>
                  </TouchableOpacity>
                )}

                <Text style={styles.contato}>• Contato</Text>

                <View style={styles.iconButtonContainer}>
                  <TouchableOpacity style={styles.iconButton}>
                    <Image source={require('../../assets/icones/WebSiteIcon.png')} style={styles.iconImageNos} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <Image source={require('../../assets/icones/ContatoIcon.png')} style={styles.iconImageNos} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <Image source={require('../../assets/icones/Telefone2Icon.png')} style={styles.iconImageNos} />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.sectionTitle, styles.horasTrabalho]}>Horas Que Trabalhamos</Text>

                {diasSemana.map((dia, index) => (
                  <View key={index} style={styles.workHoursRow}>
                    <Text style={styles.workDay}>{dia}</Text>
                    <Text style={styles.workHour}>{getHorarioDia(index)}</Text>
                  </View>
                ))}

                <Text style={styles.sectionTitle}>Profissionais</Text>

                {Doutores?.mulher?.length > 0 && (
                  <View style={styles.profGroup}>
                    <Text style={styles.profGroupTitle}>Doutoras</Text>
                    {Doutores.mulher.map((nome, i) => (
                      <Text key={`dm-${i}`} style={styles.profName}>• {nome}</Text>
                    ))}
                  </View>
                )}

                {Doutores?.homem?.length > 0 && (
                  <View style={styles.profGroup}>
                    <Text style={styles.profGroupTitle}>Doutores</Text>
                    {Doutores.homem.map((nome, i) => (
                      <Text key={`dh-${i}`} style={styles.profName}>• {nome}</Text>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.agendarContainer}>
        <TouchableOpacity style={styles.agendarButton} 
          onPress={() => navigation.navigate('AgendamentoCE', { clinicId: clinic.id, especialidadesSelecionadas: selecionados })}
        >
          <Text style={styles.agendarText}>Agendar Consulta</Text>
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
  container: { 
    flex: 1 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
   },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -27, 
  },
  divider: {
    height: 1.5,
    backgroundColor: '#a5c3a7',
    marginTop: 20,
    marginHorizontal: 16,
  },
  tabContent: {
    paddingBottom: 30,
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
  },
  numAvaliacaoText: {
    fontSize: 18,
    color: '#6d8b89',
    marginTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#6d8b89',
  },
  activeTabItem: {
    backgroundColor: 'transparent',
  },
  activeTabText: {
    color: '#fff',
    fontSize: 17,
    backgroundColor: '#000',
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 3,
  },
  navTabs: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 2.5,
    borderColor: '#ccc',
    marginTop: 10
  },
  trapezio: {
    width: 80,
    height: 9,
    backgroundColor: '#6d8b89',
    marginTop: 6,
    transform: [{ scaleX: 1.6 }],
    borderTopLeftRadius: 95,
    borderTopRightRadius: 95,
  },
  mainImage: {
    width: '100%',
    height: 250,
  },
  backArrow: {
    position: 'absolute',
    top: 45,
    left: 20,
    width: 30,
    height: 30,
    zIndex: 10,
  },
  especialidadesText:{
    fontSize: 18, 
    marginHorizontal: 16,
    marginTop: 5,
    color: '#1c404b'
  },
  starsContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingStarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avaliacaoTrapezio: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -5,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: '#6d8b89',
    marginHorizontal: 16,
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    marginTop: 20
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
    color: '#fff' 
  },
  especialidadesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
    marginTop: 15,
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
  avaliacoesContainer: {
    paddingHorizontal: 14,
  },
  btnAvaliarText: {
    color: "#77A16C",
    fontSize: 18,
    alignSelf: 'flex-end', 
    marginTop: 10,
    marginBottom: 10
  },
  btnAvaliar: {
    flexDirection: 'row',    
    alignItems: 'center',
    justifyContent: 'flex-end', 
    padding: 10,
  },
  btnAvaliarIcon: {
    width: 18,  
    height: 18,
    marginRight: 4, 
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 45,
    paddingHorizontal: 18,
    height: 54,
    borderWidth: 2,
    borderColor: "#d9d9d9",
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    color: "#333",
  },
  searchIcon: {
    width: 28,
    height: 28,
  },
  filtrosContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: 'center'
  },
  filtroBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 14,
  },
  filtroIcon: {
    marginRight: 8,
    height: 18,
    width: 18,
  },
  filtroTexto: {
    fontSize: 18,
    color: "#333",
  },
  filtroTag: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: "#CCC",
    marginRight: 14,
    minHeight: 40,
  },
  divider2: {
    height: 1.5,
    backgroundColor: '#d9d9d9',
    marginTop: 20,
  },
  tagAtivo: {
    backgroundColor: "#7FAA8C",
    borderColor: "#7FAA8C",
  },
  tagTexto: {
    color: "#777",
    fontSize: 18,
  },
  tagTextoAtivo: {
    color: "#FFF",
    fontSize: 18,
  },
  setaIcon: {
    marginLeft: 6,
    width: 12,
    height: 12,
  },
   avaliacaoCard: {
    flexDirection: "row",
    padding: 16,
    marginTop: 12,
    width: "100%",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 40,
  },
  nomeLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nomeUsuario: {
    fontSize: 24,
    fontWeight: '800',
    fontStyle: 'italic', 
    color: '#000',
    marginRight: 8,
  },
  textoAvaliacao: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 12,
  },
  iconeNota: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBold: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  linhaAvaliacao: {
    flexDirection: 'column',
    marginVertical: 4,
    marginLeft: 'auto'
  },
  linhaSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tempo: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end', 
  },
  sectionContainer: {
    paddingHorizontal: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 12,
  },
  sectionText: { 
    fontSize: 18, 
    color: '#737373', 
    lineHeight: 20,
    marginTop: 8,
  },
  leiaMaisBtn: {
    color: '#d67776',
    marginTop: 4,
    textDecorationLine: 'underline',  
    textDecorationStyle: 'solid',
    fontSize: 18
  },
  contato: {
    fontSize: 18,
    color: '#000',
    marginTop: 24,
    paddingLeft: 15,
    marginBottom: 5
  },
  iconButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  iconButton: {
    backgroundColor: '#f8f4c4',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImageNos: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  profGroup: {
    marginBottom: 10,
  },
  profGroupTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 6,
  },
  profName: { 
    fontSize: 18, 
    color: '#000',
    marginBottom: 4,
    marginLeft: 15,
  },
  workHoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  workDay: {
    fontSize: 18,
    color: "#737373",
  },
  workHour: {
    fontSize: 18,
    color: "#545454",
  },
  horasTrabalho: {
    borderBottomColor: '#d9d9d9',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingBottom: 8,
  },
  agendarContainer: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  agendarButton: {
    width: '100%',
    backgroundColor: '#799689',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3,
  },
  agendarText: { 
    color: '#fff', 
    fontSize: 17, 
    fontWeight: '700' 
  },
});