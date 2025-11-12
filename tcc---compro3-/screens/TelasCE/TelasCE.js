import React from 'react';
import { View, Text, Image, Platform, TouchableNativeFeedback,
  TouchableWithoutFeedback, SafeAreaView,} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './HomeCE';
import PerfilCE from './PerfilCE';
import ConsultasCE from './ConsultasCE';
import ChatCE from './ChatCE';

const Tab = createBottomTabNavigator();

const Header = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Findel: require('../../fonts/Findel-Display-Regular.otf'),
  });

  const currentRouteName = useNavigationState((state) => {
    if (!state) return null;
    const getActive = (s) => {
      if (!s || !s.routes || s.routes.length === 0) return null;
      const index = typeof s.index === 'number' ? s.index : s.routes.length - 1;
      const route = s.routes[index];
      if (route.state) return getActive(route.state);
      return route.name;
    };
    return getActive(state);
  });

  const isEmocoes =
    currentRouteName === 'Emoções' || currentRouteName === 'Emocoes';

  if (!fontsLoaded) return null;

  return (
    <View style={[ styles.headerContainer, { 
      backgroundColor: isEmocoes ? '#000' : '#fff' 
      },]}
    >
      <TouchableWithoutFeedback onPress={() => navigation.navigate('Notificacoes')}>
        <View style={[styles.cartButton, { backgroundColor: '#fff' }]}>
          <Image source={require('../../assets/icones/Notificacao.png')}
            style={styles.cartIcon}
            resizeMode="contain"
          />
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.centerContent}>
        <Image source={require('../../assets/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[ styles.headerText, { 
          color: isEmocoes ? '#fff' : '#000' 
          },]}
        >
          COMPRO
        </Text>
      </View>
    </View>
  );
};

const icons = {
  Home: {
    active: require('../../assets/icones/Home_Verde.png'),
    inactive: require('../../assets/icones/Home_Cinza.png'),
  },
  Loja: {
    active: require('../../assets/icones/Carrinho_Verde.png'),
    inactive: require('../../assets/icones/Carrinho_Cinza.png'),
  },
  Consultas: {
    active: require('../../assets/icones/Consultas_Verde.png'),
    inactive: require('../../assets/icones/Consultas_Cinza.png'),
  },
  Emoções: {
    active: require('../../assets/icones/Emocoes_Verde.png'),
    inactive: require('../../assets/icones/Emocoes_Cinza.png'),
  },
  Chat: {
    active: require('../../assets/icones/Chat_Verde.png'),
    inactive: require('../../assets/icones/Chat_Cinza.png'),
  },
  Perfil: {
    active: require('../../assets/icones/Homem_Verde.png'),
    inactive: require('../../assets/icones/Homem_Cinza.png'),
  },
};

const CustomTabButton = (props) => {
  const [pressed, setPressed] = React.useState(false);

  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple('#fff', false)}
        {...props}
      >
        <View style={styles.tabButtonContainer}>{props.children}</View>
      </TouchableNativeFeedback>
    );
  } else {
    return (
      <TouchableWithoutFeedback
        {...props}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
      >
        <View style={[ styles.tabButtonContainer, {
          backgroundColor: pressed ? 'rgba(255,255,255,0.3)': 'transparent',
          },]}
        >
          {props.children}
        </View>
      </TouchableWithoutFeedback>
    );
  }
};

const EmocoesTabButton = (props) => {
  const navigation = useNavigation()

  return <CustomTabButton {...props} onPress={handlePress} />;
};

export default function BottomTabs() {
  const currentRouteName = useNavigationState((state) => {
    if (!state) return null;
    const getActive = (s) => {
      if (!s || !s.routes || s.routes.length === 0) return null;
      const index = typeof s.index === 'number' ? s.index : s.routes.length - 1;
      const route = s.routes[index];
      if (route.state) return getActive(route.state);
      return route.name;
    };
    return getActive(state);
  });

  const isEmocoes =
    currentRouteName === 'Emoções' || currentRouteName === 'Emocoes';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isEmocoes ? '#000' : '#fff' }}>
      <Header />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused }) => {
            const iconSource = focused
              ? icons[route.name].active
              : icons[route.name].inactive;
            return (
              <Image source={iconSource}
                style={styles.icon}
                resizeMode="contain"
              />
            );
          },
          tabBarActiveTintColor: '#98BBA9',
          tabBarInactiveTintColor: '#555',
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarButton: (props) => <CustomTabButton {...props} /> }}
        />
        <Tab.Screen
          name="Consultas"
          component={ConsultasCE}
          options={{ tabBarButton: (props) => <CustomTabButton {...props} /> }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatCE}
          options={{ tabBarButton: (props) => <CustomTabButton {...props} /> }}
        />
        <Tab.Screen
          name="Perfil"
          component={PerfilCE}
          options={{ tabBarButton: (props) => <CustomTabButton {...props} /> }}
        />
       
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = {
  headerContainer: {
    position: 'relative',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 35,
  },
  centerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
  },
  headerText: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'Findel',
  },
  cartButton: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  cartIcon: {
    width: 36,
    height: 36,
  },
  tabBar: {
    height: 100,
    paddingBottom: 20,
  },
  tabLabel: {
    fontSize: 16,
  },
  icon: {
    width: 28,
    height: 28,
  },
  tabButtonContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
};
