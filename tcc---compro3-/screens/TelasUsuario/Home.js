import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity,
  ImageBackground, StyleSheet, ActivityIndicator} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getClinicImageById } from '../imagensProdutos'; 

export default function HomeScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [clinics, setClinics] = useState([]);
  const [loadingClinics, setLoadingClinics] = useState(true);

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
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>
          Em Destaque
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Loja')}>
          <Text style={styles.viewAll}>
            Ver tudo
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {featuredItems.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.featuredCard,
              index === 1 && { marginTop: 60, height: 210, width: 150 },
            ]}
          >
            <Image source={item.image} 
              style={styles.featuredImage} resizeMode="cover" 
            />
            <LinearGradient
              colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0.2)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.overlay}
            />
            <View style={styles.recommendedTag}>
              <Text style={styles.recommendedText}>
                Recomendado
              </Text>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSub}>{item.sold}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.cardCurrency}>R$</Text>
                <Text style={styles.cardPrice}>{item.price}</Text>
              </View>
            </View>

            <View style={styles.cardBottom}>
              <Image source={require('../../assets/icones/IconeCard.jpg')}
                style={styles.cardIcon}
                resizeMode="contain"
              />
              <TouchableOpacity style={styles.viewButton}
                onPress={() => navigation.navigate('DadosProtese', { id: item.id })}
              >
                <Text style={styles.viewButtonText}>
                  Visualizar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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

      {loadingClinics ? (
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <ActivityIndicator size="large" color="#1c404b" />
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {clinics.slice(0, 6).map(clinic => ( // aqui só pega os 5 primeiros
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
                <View>
                  <Text style={styles.clinicInfo}>{clinic.hours}</Text>
                </View>
              </View>

              <Text style={styles.clinicAtendimento}>{clinic.ageGroup}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

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
  featuredCard: {
    width: 160,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 15,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
  },
  recommendedTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 5,
  },
  recommendedText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    position: 'absolute',
    left: 10,
    top: 50,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
  },
  cardSub: {
    color: '#d5e0b5',
    fontSize: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  cardCurrency: {
    color: '#fff',
    fontSize: 18,
    marginTop: 2,
    marginRight: 2,
    alignSelf: 'flex-start',
  },
  cardPrice: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  cardBottom: {
    position: 'absolute',
    bottom: 6,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardIcon: {
    width: 34,
    height: 34,
  },
  viewButton: {
    backgroundColor: '#6d8b89',
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
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
    flexDirection: 'row', // ícone e texto lado a lado
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    marginBottom: 4,
    gap: 4,
  },
  clinicInfo: {
    fontSize: 17,
    color: '#666',
    flexWrap: 'wrap',
  },
  iconImage: {
    width: 22,
    height: 22,
    marginRight: 4,
  },
  clinicAddress: {
    fontSize: 17,
    color: '#444',
    flex: 1,
    flexWrap: 'wrap',
  },
});
