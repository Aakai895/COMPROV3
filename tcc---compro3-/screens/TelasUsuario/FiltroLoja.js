// src/screens/Filtro.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions,
  ScrollView, Platform, StatusBar, TouchableOpacity, Image,
  Alert,
} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const STORAGE_KEY = 'loja_filters';

export default function Home({ navigation, route }) {
  const [values, setValues] = useState([0, 100]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedGender, setSelectedGender] = useState('Todos');
  const [hasSavedFilters, setHasSavedFilters] = useState(false);

  const ratings = [
    '4.5 - 5.0',
    '4.0 - 4.5',
    '3.5 - 4.0',
    '3.0 - 3.5',
    '2.5 - 3.0',
    '2.0 - 2.5',
  ];

  const proteses = [
    'Todos',
    'Transtibial',
    'Transfemoral',
    'Desart. joelho',
    'Parcial de pé',
    'Desart. de mão',
    'Prót. de Antebraço',
    'Prót. de Braço'
  ];

  const normalize = (str) =>
  String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/\./g, '')
    .toLowerCase()
    .trim();

  const sliderToPrice = (v) => Math.round(1000 + v * 790);
  const priceToSlider = (price) => {
    const s = Math.round((price - 1000) / 790);
    if (isNaN(s)) return 0;
    return Math.max(0, Math.min(100, s));
  };

  const loadFilters = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setHasSavedFilters(false);
        return;
      }
      const f = JSON.parse(raw);
      setSelectedType(f.tipo ?? 'Todos');
      setSelectedGender(f.genero ?? 'Todos');
      setSelectedValue(typeof f.avaliacao === 'undefined' ? null : f.avaliacao);
      const minSlider = priceToSlider(f.precoMin ?? 1000);
      const maxSlider = priceToSlider(f.precoMax ?? 80000);
      setValues([minSlider, maxSlider]);
      setHasSavedFilters(true);
    } catch (e) {
      console.error('Erro ao carregar filtros:', e);
    }
  };

  useEffect(() => {
    loadFilters();
  }, []);

  const saveFilters = async (filtros) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtros));
      setHasSavedFilters(true);
    } catch (e) {
      console.error('Erro ao salvar filtros:', e);
    }
  };

  const clearSavedFilters = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setSelectedType('Todos');
      setSelectedGender('Todos');
      setSelectedValue(null);
      setValues([0, 100]);
      setHasSavedFilters(false);
      Alert.alert('Filtros', 'Filtros limpos com sucesso.');
    } catch (e) {
      console.error('Erro ao limpar filtros:', e);
    }
  };

  const handleConcluir = async () => {
    const precoMin = sliderToPrice(values[0]);
    const precoMax = sliderToPrice(values[1]);
    const filtros = {
      tipo: selectedType,
      genero: selectedGender,
      avaliacao: selectedValue ?? null,
      precoMin,
      precoMax,
    };
    await saveFilters(filtros);
    
    navigation.navigate('TelasUsuario', {
      screen: 'Loja',
      params: { filtros },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnVoltar}
          onPress={() => navigation.navigate('TelasUsuario', { screen: 'Loja' })}
        >
          <Image source={require('../../assets/icones/SetaVoltar.png')}
            style={styles.imgVoltar}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Filtro
        </Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>
              Gênero
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {['Todos', 'Feminino', 'Masculino', 'Unissex'].map((gender, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedGender(gender)}
                  style={[
                    styles.genderButton,
                    selectedGender === gender ? styles.verde : styles.brancoScroll,
                  ]}
                >
                  <Text style={[styles.text, selectedGender === gender ? styles.textBranco : {}]}>
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel2}>
              Tipos de Próteses
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {proteses.map((tipo, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedType(tipo)}
                  style={[
                    styles.tipoButton,
                    selectedType === tipo ? styles.verde : styles.brancoScroll,
                  ]}
                >
                  <Text style={[styles.text, selectedType === tipo ? styles.textBranco : {}]}>
                    {tipo}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel2}>
              Preço
            </Text>
            <View style={{ alignItems: 'center' }}>
              <MultiSlider
                values={values}
                sliderLength={screenWidth - 50}
                onValuesChange={(vals) => setValues(vals)}
                min={0}
                max={100}
                step={1}
                selectedStyle={{ backgroundColor: '#a8c9a3', height: 10 }}
                unselectedStyle={{ backgroundColor: '#d9d9d9', height: 10, borderRadius: 100 }}
                markerStyle={{
                  backgroundColor: '#a8c9a3',
                  height: 28,
                  width: 28,
                  borderRadius: 14,
                  borderWidth: 5,
                  borderColor: '#f5f5f5',
                  elevation: 3,
                  marginTop: 3,
                }}
              />
            </View>
            <View style={styles.priceRange}>
              <Text style={styles.text}>R$ {sliderToPrice(values[0]).toLocaleString('pt-BR')}</Text>
              <Text style={styles.text}>R$ {sliderToPrice(values[1]).toLocaleString('pt-BR')}{' '}{values[1] === 100 ? '+' : ''}</Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel2}>
              Avaliações
            </Text>

            {ratings.map((rating) => (
              <View key={rating} style={styles.ratingRow}>
                <View style={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Entypo key={i} name="star" size={22} color="#6d8b89" />
                  ))}
                  <Text style={[styles.text, { marginLeft: 12, fontSize: 18 }]}>{rating}</Text>
                </View>

                <TouchableOpacity onPress={() => {
                    setSelectedValue(prev => (prev === rating ? null : rating));
                  }}
                  style={{
                    height: 28,
                    width: 28,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: selectedValue === rating ? '#a8c9a3' : '#999',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selectedValue === rating && (
                    <View style={{
                      height: 14,
                      width: 14,
                      borderRadius: 7,
                      backgroundColor: '#a8c9a3',
                    }}
                    />
                  )}
                </TouchableOpacity>
              </View>
            ))}

          </View>
        </ScrollView>

        <View style={styles.footer}>
          {hasSavedFilters && (
            <TouchableOpacity style={[styles.button, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', marginBottom: 8 }]}
              onPress={clearSavedFilters}
            >
              <Text style={[styles.buttonText, { color: '#000' }]}>
                Limpar filtros
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.button}
            onPress={handleConcluir}
          >
            <Text style={styles.buttonText}>
              Concluir
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  btnVoltar: {
    marginRight: 15,
  },
  imgVoltar: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 28,
    textAlign: 'center',
    flex: 1,
    color: '#000',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingVertical: 30,
  },
  sectionContainer: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  sectionLabel: {
    fontSize: 22,
    color: '#000',
    marginBottom: 10,
  },
  sectionLabel2: {
    fontSize: 22,
    color: '#000',
    marginBottom: 10,
  },
  genderButton: {
    marginRight: 15,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipoButton: {
    marginRight: 15,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verde: {
    backgroundColor: '#a5c3a7',
  },
  brancoScroll: {
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
  },
  textBranco: {
    color: 'white',
  },
  priceRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
    marginBottom: 35,
    paddingHorizontal: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#a5c3a7',
    width: '100%',
    borderRadius: 100,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
  },
  horizontalScroll: {
    paddingVertical: 10,
  },
});
