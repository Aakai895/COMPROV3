import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity,
  ImageBackground, StyleSheet,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function HomeScreen() {
  const navigation = useNavigation();
  const clinics = [
    {
      id: 1,
      name: 'Clínica da Família',
      address: 'Praça Mestre de Assis, 20 - SP',
      hours: '11:00h - 20:00h  |  Seg-Sex',
      ageGroup: 'Atende: Todas Idades',
      image: require('../../assets/Clinicas/Clinica1.jpg'),
    },
    {
      id: 2,
      name: 'Clínica Rebre',
      address: 'Rua Castro Alves, 92 - SP',
      hours: '09:00h - 18:00h  |  Seg-Sab',
      ageGroup: 'Atende: Adultos e Idosos',
      image: require('../../assets/Clinicas/Clinica2.jpg'),
    },
    {
      id: 3,
      name: 'Instituto Vida Leve',
      address: 'Av. Brasil, 1500 - Rio de Janeiro',
      hours: '08:00h - 17:00h  |  Seg-Sex',
      ageGroup: 'Atende: Todas Idades',
      image: require('../../assets/Clinicas/Clinica3.jpg'),
    },
    {
      id: 4,
      name: 'Clínica Nova Esperança',
      address: 'Rua das Flores, 123 - Belo Horizonte',
      hours: '10:00h - 19:00h | Seg-Sex',
      ageGroup: 'Atende: Crianças e Adultos',
      image: require('../../assets/Clinicas/Clinica4.jpg'),
    },
    {
      id: 5,
      name: 'Centro Médico São Lucas',
      address: 'Av. Central, 555 - Curitiba',
      hours: '08:00h - 18:00h | Seg-Sáb',
      ageGroup: 'Atende: Todas Idades',
      image: require('../../assets/Clinicas/Clinica5.jpg'),
    },
    {
      id: 6,
      name: 'Clínica Vida Plena',
      address: 'Rua das Acácias, 77 - Porto Alegre',
      hours: '09:00h - 17:00h | Seg-Sex',
      ageGroup: 'Atende: Adultos',
      image: require('../../assets/Clinicas/Clinica6.jpg'),
    },
    {
      id: 7,
      name: 'Clínica Bem Estar',
      address: 'Av. Liberdade, 1010 - Salvador',
      hours: '10:00h - 20:00h | Seg-Dom',
      ageGroup: 'Atende: Todas Idades',
      image: require('../../assets/Clinicas/Clinica7.jpg'),
    },
  ];

  const maintenanceCompanies = [
    {
      id: 1,
      name: 'Oficina ProFix',
      address: 'Rua das Engrenagens, 45 - SP',
      service: 'Ajustes em próteses e órteses',
      hours: '08:00h - 17:00h | Seg-Sex',
      image: require('../../assets/Empresas/Empresa1.jpg.jpeg'),
    },
    {
      id: 2,
      name: 'Reparo+ Saúde',
      address: 'Av. Técnica, 900 - RJ',
      hours: '09:00h - 18:00h | Seg-Sáb',
      image: require('../../assets/Empresas/Empresa2.jpg.jpeg'),
    },
    {
      id: 3,
      name: 'Manutenção Ortopédica',
      address: 'Rua do Comércio, 321 - Recife',
      service: 'Conserto rápido de próteses',
      hours: '08:00h - 16:00h | Seg-Sex',
      image: require('../../assets/Empresas/Empresa3.jpg.jpeg'),
    },
    {
      id: 4,
      name: 'Tech Ortopedia',
      address: 'Av. das Nações, 400 - Fortaleza',
      service: 'Ajustes e reparos especializados',
      hours: '09:00h - 19:00h | Seg-Sáb',
      image: require('../../assets/Empresas/Empresa4.jpg.jpeg'),
    },
    {
      id: 5,
      name: 'Próteses & Cia',
      address: 'Rua Nova, 150 - Brasília',
      service: 'Reparo e manutenção geral',
      hours: '08:00h - 17:00h | Seg-Sex',
      image: require('../../assets/Empresas/Empresa5.jpg.jpeg'),
    },
    {
      id: 6,
      name: 'Centro de Manutenção Ortopédica',
      address: 'Av. Central, 250 - Campinas',
      service: 'Reparos e manutenção preventiva',
      hours: '10:00h - 18:00h | Seg-Sáb',
      image: require('../../assets/Empresas/Empresa6.jpg.jpeg'),
    },
  ];

  const featuredItems = [
    {
      id: 1,
      title: 'Prótese Transtibial',
      sold: '3.000 vendidas',
      price: '9.700,50',
      image: require('../../assets/Proteses/DestaqueProtese1.jpg.jpg'),
    },
    {
      id: 2,
      title: 'Prótese Transtibial',
      sold: '2.810 vendidas',
      price: '4.257,90',
      image: require('../../assets/Proteses/DestaquePrptese2.jpg.jpg'),
    },
    {
      id: 3,
      title: 'Prótese Transfemoral',
      sold: '1.257 vendidas',
      price: '10.500,00',
      image: require('../../assets/Proteses/DestaqueProtese3.jpg.jpg'),
    },
  ];

  return (
    <ScrollView style={styles.homeContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>
          Empresas de Manutenção
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Consultas')}>
          <Text style={styles.viewAll}>
            Ver tudo
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {maintenanceCompanies.map((company) => (
          <TouchableOpacity key={company.id} style={styles.clinicCard} onPress={() => {}}>
            <Image source={company.image} 
              style={styles.clinicImage} 
            />
            <Text style={styles.clinicTitle}>{company.name}</Text>
            
            <View style={styles.clinicDivider} />
            
            <View style={styles.iconRow}>
              <Image source={require('../../assets/icones/Location.png')}
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

      <View style={styles.divider} />

      <ImageBackground source={require('../../assets/Plano_Fundo/ExploreApp.jpg.png')}
        style={styles.exploreApp}
        imageStyle={{ borderRadius: 10 }}
      >
        <Text style={styles.exploreText}>
          --- Explore nosso app ---
        </Text>
      </ImageBackground>

      <View style={styles.divider} />

      <View style={styles.sectionHeader}>
        <Text style={styles.title}>
          Clínicas
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Consultas')}>
          <Text style={styles.viewAll}>
            Ver tudo
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {clinics.map((clinic) => (
          <TouchableOpacity key={clinic.id} style={styles.clinicCard} onPress={() => {}}>
            <Image source={clinic.image} 
              style={styles.clinicImage} 
            />
            <Text style={styles.clinicTitle}>{clinic.name}</Text>
            
            <View style={styles.clinicDivider} />
            
            <View style={styles.iconRow}>
              <Image source={require('../../assets/icones/Location.png')}
                style={styles.iconImage}
              />
              <Text style={styles.clinicAddress}>{clinic.address}</Text>
            </View>
            <View style={styles.iconRow}>
              <MaterialCommunityIcons name="clock" size={24} color="black" />
              <Text style={styles.clinicInfo}>{clinic.hours}</Text>
            </View>
            <Text style={styles.clinicAtendimento}>{clinic.ageGroup}</Text>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 22,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1c404b'
  },
  viewAll: {
    fontSize: 16,
    color: '#004472',
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#d9d9d9',
    marginBottom: 10,
  },
  exploreApp: {
    height: 70,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exploreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
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
    fontSize: 17,
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
  clinicAddress: {
    fontSize: 17,
    color: '#444',
    marginLeft: 2,
  },
  clinicInfo: {
    fontSize: 17,
    color: '#666',
    marginLeft: 4,
  },
  clinicAtendimento: {
    marginTop: 8,
    paddingHorizontal: 10,
    fontSize: 17,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  iconImage: {
    width: 22,
    height: 22,
    marginRight: 4,
  },
});
