import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions,
  ScrollView, Platform, StatusBar, TouchableOpacity, Image, } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const screenWidth = Dimensions.get('window').width;

export default function Home({ navigation }) {
  const [values, setValues] = useState([20, 80]);
  const [selectedValue, setSelectedValue] = useState('4.5 - 5.0');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedTypes, setSelectedTypes] = useState([]); 

  const categorias = ['Todos', 'Clínicas', 'Manutenções'];
  const tipos = [
    {
      titulo: 'Especialidades Médicas',
      itens: [
        'Clínico Geral', 'Cardiologista', 'Dermatologista', 'Ginecologista', 'Ortopedista', 'Pediatra',
        'Endocrinologista', 'Neurologista', 'Urologista', 'Otorrinolaringologista', 'Reumatologista',
        'Gastroenterologista', 'Oftalmologista', 'Nefrologista', 'Oncologista', 'Hematologista',
        'Infectologista', 'Alergista / Imunologista', 'Angiologista', 'Cirurgião Geral',
        'Cirurgião Plástico', 'Mastologista',
      ],
    },
    {
      titulo: 'Especialidades Complementares',
      itens: [
        'Nutricionista', 'Fisioterapeuta', 'Fonoaudiólogo', 'Terapeuta Ocupacional',
        'Psicopedagogo', 'Acupunturista', 'Quiropraxista',
      ],
    },
    {
      titulo: 'Serviços de Apoio e Exames',
      itens: [
        'Exames Laboratoriais', 'Ultrassonografia', 'Eletrocardiograma (ECG)', 'Raio-X',
        'Ressonância Magnética', 'Tomografia Computadorizada', 'Mamografia',
        'Endoscopia', 'Teste Ergométrico', 'Audiometria',
      ],
    },
  ];

  const ratings = [
    '4.5 - 5.0',
    '4.0 - 4.5',
    '3.5 - 4.0',
    '3.0 - 3.5',
    '2.5 - 3.0',
    '2.0 - 2.5',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnVoltar}
          onPress={() => navigation.navigate('TelasUsuario', { screen: 'Consultas' })}
        >
          <Image source={require('../../assets/icones/SetaVoltar.png')}
            style={styles.imgVoltar}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Filtro
        </Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>
            Categorias
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.horizontalScroll}
          >
            {categorias.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedCategory(item)}
                style={[styles.optionButton, selectedCategory === item ? styles.verde : styles.brancoScroll]}
              >
                <Text style={[styles.text, selectedCategory === item ? styles.textBranco : {}]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>
            Serviços
          </Text>

          {tipos.map((categoria, idx) => (
            <View key={idx} style={{ marginBottom: 20 }}>
              <Text style={[styles.text, { marginBottom: 10, fontSize: 18, color: '#555' }]}>
                {categoria.titulo}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {categoria.itens.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedTypes((prev) =>
                        prev.includes(item)
                          ? prev.filter((i) => i !== item)
                          : [...prev, item]
                      );
                    }}
                    style={[
                      styles.optionButton,
                      selectedTypes.includes(item) ? styles.verde : styles.brancoScroll,
                    ]}
                  >
                    <Text style={[styles.text, selectedTypes.includes(item) ? styles.textBranco : {}]}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>
            Distância
          </Text>
          <View style={{ alignItems: 'center' }}>
            <MultiSlider
              values={values}
              sliderLength={screenWidth - 50}
              onValuesChange={setValues}
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
            <Text style={styles.text}>1Km</Text>
            <Text style={styles.text}>100Km+</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>
            Avaliações
          </Text>
          {ratings.map((rating, index) => (
            <View key={index} style={styles.ratingRow}>
              <View style={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Entypo key={i} name="star" size={20} color="#6d8b89" />
                ))}
                <Text style={[styles.text, { marginLeft: 16 }]}>{rating}</Text>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedValue(rating)}
                style={[styles.radioCircle, {
                  borderColor: selectedValue === rating ? '#a8c9a3' : '#999',
                }]}
              >
                {selectedValue === rating && <View style={styles.radioDot} />}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} 
          onPress={() => navigation?.navigate?.('TelasUsuario', { screen: 'Consultas' })}
        >
          <Text style={styles.buttonText}>Concluir</Text>
        </TouchableOpacity>
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
  optionButton: {
    marginRight: 15,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalScroll: {
    paddingVertical: 10,
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
    fontSize: 20,
  },
  textBranco: {
    color: '#fff',
  },
  priceRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
    marginBottom: 35,
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
  radioCircle: {
    height: 28,
    width: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: '#a8c9a3',
  },
  footer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 40,
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
    marginBottom: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
  },
});
