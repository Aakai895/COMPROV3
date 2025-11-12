import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView,
  ActivityIndicator, TouchableOpacity, FlatList,
  Dimensions, TouchableWithoutFeedback, TextInput,
  Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getClinicImageById } from '../imagensProdutos'; 
import Svg, { Polygon, Rect, ClipPath, Defs } from 'react-native-svg';

export default function DetalhesClinica() {
  const route = useRoute();
  const navigation = useNavigation();
  const widthTop = 300;
  const height = 70;   
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selecionados] = useState([]);
  const { clinicId } = route.params || {};
  const id = clinicId;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

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
    image,
  } = clinic;

  const addressText = `${addressObj.ruaAvenidaPraca || ''}, ${addressObj.numero || ''} - ${addressObj.bairro || ''}, ${addressObj.Cidade || ''}`;

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

  const Star2 = ({ size = 60, filled }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Polygon
        points="12,2 15,10 23,10 17,14 19,22 12,17 5,22 7,14 1,10 9,10"
        fill={filled ? '#b89b00' : '#f8f4c4'} 
      />
    </Svg>
  );

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

  return (
    <View style={styles.screen}>
      <View style={ styles.headerContainer }>
         <Image
          source={image}
          style={styles.mainImage}
        />

        <TouchableWithoutFeedback onPress={() => navigation.navigate('VisualizarCE', {id: clinic.id})}>
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
      </View>

      <View style={styles.avaliacaoUsuarioContainer}>
        <Text style={styles.avaliacaoTitulo}>Sua avaliação final desse Produto</Text>

        <View style={styles.starsUserContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity 
              key={star} 
              onPress={() => setRating(star)} 
              style={{ marginHorizontal: 6 }}
            >
              <Star2 filled={star <= rating} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
        
      <View style={styles.divider2} />
      
      <View style={styles.textbox}>
        <TextInput
          style={styles.textInput}
          placeholder="Deixe um comentário sobre sua experiência..."
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
          value={comment}
          onChangeText={setComment}
        />
      </View>

      <View style={styles.agendarContainer}>
        <TouchableOpacity
          style={styles.agendarButton}
          onPress={() => {
            if (rating === 0) {
              Alert.alert('Atenção', 'Por favor, selecione uma quantidade de estrelas antes de enviar sua avaliação.');
              return;
            }

            if (comment.trim() === '') {
              Alert.alert('Atenção', 'Por favor, escreva um comentário sobre sua experiência.');
              return;
            }

            Alert.alert(
              'Avaliação enviada!',
              `Obrigado por sua avaliação de ${rating} estrela${rating > 1 ? 's' : ''}!\n\nSeu comentário:\n"${comment}"`,
              [{ text: 'OK' }]
            );

            setRating(0);
            setComment('');
          }}
        >
          <Text style={styles.agendarText}>Avaliar</Text>
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
  divider2: {
    height: 1.5,
    backgroundColor: '#d9d9d9',
    marginTop: 15,
    marginBottom: 15,
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
  avaliacaoUsuarioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  avaliacaoTitulo: {
    fontSize: 18,
    color: '#00',
    marginBottom: 10,
  },
  starsUserContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  textInput: {
    width: '85%',
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 18,
    color: '#000',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#d9d9d9',
  },
  textbox: {
    alignItems: 'center'
  }
});