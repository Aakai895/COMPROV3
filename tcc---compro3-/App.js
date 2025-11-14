import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Telas Usuário
import Loading from './screens/Loading';
import Bem_Vindo3 from './screens/BoasVindas/Bem_Vindo3';
import Bem_Vindo2 from './screens/BoasVindas/Bem_Vindo2';
import Bem_Vindo1 from './screens/BoasVindas/Bem_Vindo1';
import Login from './screens/Cadastro&Login/Login';
import TipoCadastro from './screens/Cadastro&Login/TipoCadastro';
import Cadastrouni from './screens/Cadastro&Login/cadastrounificado1';
import Cadastrouni2 from './screens/Cadastro&Login/cadastrounificado2'
import EsqueciSenha from './screens/Cadastro&Login/EsqueciSenha';
import TelasUsuario from './screens/TelasUsuario/TelasUsuario';
import Home from './screens/TelasUsuario/Home';
import Carrinho from './screens/TelasUsuario/Carrinho';
import FormasCompra from './screens/TelasUsuario/Compra';
import Loja from './screens/TelasUsuario/Loja';
import FiltroLoja from './screens/TelasUsuario/FiltroLoja';
import Consultas from './screens/TelasUsuario/Consultas';
import FiltroConsultas from './screens/TelasUsuario/FiltroConsultas';
import MinhasConsultas from './screens/TelasUsuario/MinhasConsultas';
import CancelarConsulta from './screens/TelasUsuario/CancelarConsulta';
import Perfil from './screens/TelasUsuario/Perfil';
import Seguro from './screens/TelasUsuario/Seguro';
import PoliticaPrivacidade from './screens/TelasUsuario/PoliticaPrivacidade';
import Suporte from './screens/TelasUsuario/Suporte';
import Configuracoes from './screens/TelasUsuario/Configuracoes';
import PerguntasFrequentes from './screens/TelasUsuario/PerguntasFreq';
import SplashEmocoes from './screens/Splash/EmocoesSplash';
import Emocoes from './screens/TelasUsuario/Emocoes';
import Humores from './screens/TelasUsuario/Humores';
import Chat from './screens/TelasUsuario/Chat';
import Conversa from './screens/TelasUsuario/Conversa';
import Profile from './screens/TelasUsuario/Profile';
import DadosProtese from './screens/TelasUsuario/DadosProtese';
import AdicionarProtese from './screens/Splash/AdicionarProtese';
import DadosClieEmp from './screens/TelasUsuario/DadosClieEmp';
import VisualizarCE from './screens/TelasUsuario/VisualizarCE';
import AgendamentoCE from './screens/TelasUsuario/AgendamentoCE';
import SucessoConsulta from './screens/Splash/SucessoConsulta';
import FalhaConsulta from './screens/Splash/FalhaConsulta';
import AvaliarCE from './screens/TelasUsuario/AvaliarCE';

// Telas Clínicas e Empresas
import TelasCE from './screens/TelasCE/TelasCE';
import HomeCE from './screens/TelasCE/HomeCE';
import PerguntasFreqCE from './screens/TelasCE/PerguntasFreqCE';
import ConfiguracoesCE from './screens/TelasCE/ConfiguracoesCE';
import SuporteCE from './screens/TelasCE/SuporteCE';
import PoliticaPrivCE from './screens/TelasCE/PoliticaPriCE';
import ConsultasCE from './screens/TelasCE/ConsultasCE';
import ChatCE from './screens/TelasCE/ChatCE';
import ConversaCE from './screens/TelasCE/ConversaCE';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="Bem_Vindo1" component={Bem_Vindo1} />
        <Stack.Screen name="Bem_Vindo2" component={Bem_Vindo2} />
        <Stack.Screen name="Bem_Vindo3" component={Bem_Vindo3} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="EsqueciSenha" component={EsqueciSenha} />
        <Stack.Screen name="TipoCadastro" component={TipoCadastro} />
        <Stack.Screen name="Cadastrouni" component={Cadastrouni} />
        <Stack.Screen name="Cadastrouni2" component={Cadastrouni2} />
        <Stack.Screen name="TelasUsuario" component={TelasUsuario} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Carrinho" component={Carrinho} />
        <Stack.Screen name="FormasCompra" component={FormasCompra} />
        <Stack.Screen name="Loja" component={Loja} />
        <Stack.Screen name="FiltroLoja" component={FiltroLoja} />
        <Stack.Screen name="Consultas" component={Consultas} />
        <Stack.Screen name="FiltroConsultas" component={FiltroConsultas} />
        <Stack.Screen name="MinhasConsultas" component={MinhasConsultas} />
        <Stack.Screen name="CancelarConsulta" component={CancelarConsulta} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Seguro" component={Seguro} />
        <Stack.Screen name="PoliticaPrivacidade" component={PoliticaPrivacidade} />
        <Stack.Screen name="Suporte" component={Suporte} />
        <Stack.Screen name="Configuracoes" component={Configuracoes} />
        <Stack.Screen name="PerguntasFrequentes" component={PerguntasFrequentes} />
        <Stack.Screen name="SplashEmocoes" component={SplashEmocoes} />
        <Stack.Screen name="Emocoes" component={Emocoes} />
        <Stack.Screen name="Humores" component={Humores} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Conversa" component={Conversa} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="DadosProtese" component={DadosProtese} />
        <Stack.Screen name="AdicionarProtese" component={AdicionarProtese} />
        <Stack.Screen name="DadosClieEmp" component={DadosClieEmp} />
        <Stack.Screen name="VisualizarCE" component={VisualizarCE} />
        <Stack.Screen name="AgendamentoCE" component={AgendamentoCE} />
        <Stack.Screen name="SucessoConsulta" component={SucessoConsulta} />
        <Stack.Screen name="FalhaConsulta" component={FalhaConsulta} />
        <Stack.Screen name="AvaliarCE" component={AvaliarCE} />
        <Stack.Screen name="TelasCE" component={TelasCE} />
        <Stack.Screen name="HomeCE" component={HomeCE} />
        <Stack.Screen name="PerguntasFreqCE" component={PerguntasFreqCE} />
        <Stack.Screen name="ConfiguracoesCE" component={ConfiguracoesCE} />
        <Stack.Screen name="SuporteCE" component={SuporteCE} />
        <Stack.Screen name="PoliticaPrivCE" component={PoliticaPrivCE} />
        <Stack.Screen name="ConsultasCE" component={ConsultasCE} />
        <Stack.Screen name="ChatCE" component={ChatCE} />
        <Stack.Screen name="ConversaCE" component={ConversaCE} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
