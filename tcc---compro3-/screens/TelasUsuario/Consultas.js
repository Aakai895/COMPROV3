import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, 
StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getClinicImageById } from '../imagensProdutos'; 

export default function Consultas({ navigation }) {
  const [search, setSearch] = useState('');
  const [clinics, setClinics] = useState([]);
  const [loadingClinics, setLoadingClinics] = useState(true);

  const maintenanceCompanies = [
    {
      id: 1,
      name: 'Oficina ProFix',
      address: 'Rua das Engrenagens, 45 - SP',
      service: 'Ajustes em próteses e órteses',
      hours: '08:00h - 17:00h | Seg‑Sex',
      image: require('../../assets/Empresas/Empresa1.jpg.jpeg'),
    },
    {
      id: 2,
      name: 'Reparo+ Saúde',
      address: 'Av. Técnica, 900 - RJ',
      hours: '09:00h - 18:00h | Seg‑Sáb',
      image: require('../../assets/Empresas/Empresa2.jpg.jpeg'),
    },
    {
      id: 3,
      name: 'Manutenção Ortopédica',
      address: 'Rua do Comércio, 321 - Recife',
      service: 'Conserto rápido de próteses',
      hours: '08:00h - 16:00h | Seg‑Sex',
      image: require('../../assets/Empresas/Empresa3.jpg.jpeg'),
    },
    {
      id: 4,
      name: 'Tech Ortopedia',
      address: 'Av. das Nações, 400 - Fortaleza',
      service: 'Ajustes e reparos especializados',
      hours: '09:00h - 19:00h | Seg‑Sáb',
      image: require('../../assets/Empresas/Empresa4.jpg.jpeg'),
    },
    {
      id: 5,
      name: 'Próteses & Cia',
      address: 'Rua Nova, 150 - Brasília',
      service: 'Reparo e manutenção geral',
      hours: '08:00h - 17:00h | Seg‑Sex',
      image: require('../../assets/Empresas/Empresa5.jpg.jpeg'),
    },
    {
      id: 6,
      name: 'Centro de Manutenção Ortopédica',
      address: 'Av. Central, 250 - Campinas',
      service: 'Reparos e manutenção preventiva',
      hours: '10:00h - 18:00h | Seg‑Sáb',
      image: require('../../assets/Empresas/Empresa6.jpg.jpeg'),
    },
  ];

  useEffect(() => {
    fetch('https://compro-2-sandy.vercel.app/')
      .then(response => response.text())
      .then(text => {
        try {
          const data = eval(text);
          const mapped = data.map(item => ({
            id: item.id,
            name: item.nome,
            address: `${item.Endereco.ruaAvenidaPraca}, ${item.Endereco.numero} - ${item.Endereco.bairro}, ${item.Endereco.Cidade}`,
            hours: item.horarioAtendimento
              ? `${item.horarioAtendimento.início} - ${item.horarioAtendimento.fim}`
              : 'Horário não disponível',
            ageGroup: item.publico ? `Atende: ${item.publico.join(', ')}` : 'Público não informado',
            image: getClinicImageById(item.id),
          }));
          setClinics(mapped);
        } catch (e) {
          console.error('Erro ao avaliar os dados da API:', e);
        }
        setLoadingClinics(false);
      })
      .catch(error => {
        console.error('Erro ao buscar clínicas:', error);
        setLoadingClinics(false);
      });
  }, []);

  return (
    <ScrollView style={styles.homeContainer}>
      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => navigation.navigate('FiltroConsultas')}
        >
          <Image
            source={require('../../assets/icones/FiltroIcon.png')}
            style={{ width: 40, height: 40, tintColor: '#fff' }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="O que você procura?..."
            placeholderTextColor="#555"
            value={search}
            onChangeText={setSearch}
          />

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              setSearchTerm(search);
            }}
          >
            <Image source={require('../../assets/icones/LupaIcon.png')}
              style={{ width: 45, height: 45 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('MinhasConsultas')}
      >
        <Image
          source={require('../../assets/icones/BotaoConsultas.png')}
          style={styles.imageButton}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Clínicas</Text>
      </View>

      {loadingClinics ? (
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <ActivityIndicator size="large" color="#1c404b" />
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {clinics.map(clinic => (
            <TouchableOpacity
              key={clinic.id}
              style={styles.clinicCard}
              onPress={() => navigation.navigate('VisualizarCE', { id: clinic.id })}>

              <Image source={clinic.image} style={styles.clinicImage} />
              <Text style={styles.clinicTitle}>{clinic.name}</Text>
              <View style={styles.clinicDivider} />

              <View style={styles.iconRow}>
                <Image
                  source={require('../../assets/icones/Location.png')}
                  style={styles.iconImage}
                />
                <Text style={styles.clinicAddress}>{clinic.address}</Text>
              </View>

             <View style={styles.iconColumn}>
              <MaterialCommunityIcons name="clock" size={24} color="black" />
                <Text style={styles.clinicInfo}>{clinic.hours}</Text>
            </View>

            <Text style={styles.clinicAtendimento}>{clinic.ageGroup}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Manutenção</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {maintenanceCompanies.map((company) => (
          <TouchableOpacity key={company.id} style={styles.clinicCard} onPress={() => {}}>
            <Image source={company.image} style={styles.clinicImage} />
            <Text style={styles.clinicTitle}>{company.name}</Text>
            <View style={styles.clinicDivider} />

            <View style={styles.iconRow}>
              <Image
                source={require('../../assets/icones/Location.png')}
                style={styles.iconImage}
              />
              <Text style={styles.clinicAddress}>{company.address}</Text>
            </View>

            <View style={styles.iconRow}>
              <MaterialCommunityIcons name="clock" size={24} color="black" />
              <Text style={styles.clinicInfo}>{company.hours}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 25,
  },
  filterButton: {
    backgroundColor: '#6d8b89',
    width: 80,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    marginRight: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 22,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#1c404b',
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  clinicCard: {
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#e7e7e7',
    overflow: 'hidden',
    marginRight: 15,
    paddingBottom: 12,
  },
  clinicImage: {
    width: '100%',
    height: 110,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  clinicTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#a5c3a7',
    marginRight: 10,
    marginLeft: 10,
  },
  clinicDivider: {
    marginTop: 10,
  },
  clinicAtendimento: {
    marginTop: 8,
    paddingHorizontal: 10,
    fontSize: 17,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    marginBottom: 4,
    gap: 4,
  },
  iconColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    marginBottom: 4,
    gap: 4,
  },
  clinicInfo: {
    fontSize: 17,
    color: '#444',
    flexWrap: 'wrap',
  },
  iconImage: {
    width: 22,
    height: 22,
    marginRight: 4,
  },
  container: {
    width: "100%",
    marginVertical: 10,
  },
  imageButton: {
    width: 400,
    height: 80,
    alignSelf: 'center',
  },
  clinicAddress: {
    fontSize: 17,
    color: '#444',
    flex: 1,
    flexWrap: 'wrap',
  },
});
