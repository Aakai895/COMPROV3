export const getImagemPorId = (id) => {
  switch (id) {
    case 1:
      return require('../assets/Proteses/DestaqueProtese1.jpg.jpg');
    case 2:
      return require('../assets/Proteses/DestaquePrptese2.jpg.jpg');
    case 3:
      return require('../assets/Proteses/DestaqueProtese3.jpg.jpg');
    case 4:
      return require('../assets/Proteses/Protese4.jpg');
    case 5:
      return require('../assets/Proteses/Transfemoral.jpeg');
    case 6:
      return require('../assets/Proteses/Transfemoral2.jpeg');
    case 7:
      return require('../assets/Proteses/Tranfemoral5.jpeg');
    case 8:
      return require('../assets/Proteses/Pe3.jpeg');
    case 9:
      return require('../assets/Proteses/Pe.jpeg');
    case 10:
      return require('../assets/Proteses/Pe2.jpeg');
    case 11:
      return require('../assets/Proteses/Maao.jpeg');
    case 12:
      return require('../assets/Proteses/Maao2.jpeg');
    case 13:
      return require('../assets/Proteses/proteseMao.jpg');
    case 14:
      return require('../assets/Proteses/ProteseMao2.jpg');
    case 15:
      return require('../assets/Proteses/ProteseAntebraco.jpg');
    case 16:
      return require('../assets/Proteses/ProteseAntebraco2.jpg');
    case 17:
      return require('../assets/Proteses/Antebraco3.jpeg');
    case 18:
      return require('../assets/Proteses/Antebraco4.jpeg');
    case 19:
      return require('../assets/Proteses/ProteseBraco.jpg');
    case 20:
      return require('../assets/Proteses/ProteseBraco2.jpg');
  }
};

// clinicImages.js
export const getClinicImageById = (id) => {
  switch (id) {
    case 1:
      return require('../assets/Clinicas/Clinica1.jpg');
    case 2:
      return require('../assets/Clinicas/Clinica2.jpg');
    case 3:
      return require('../assets/Clinicas/Clinica3.jpg');
    case 4:
      return require('../assets/Clinicas/Clinica4.jpg');
    case 5:
      return require('../assets/Clinicas/Clinica5.jpg');
    case 6:
      return require('../assets/Clinicas/Clinica6.jpg');
    case 7:
      return require('../assets/Clinicas/Clinica7.jpg');
  }
};

const imagensEspecialidades = {
  Fisioterapia: require('../assets/Clinicas/Clinica7.jpg'),
};

export function getImagemEspecialidade(nome) {
  return imagensEspecialidades[nome] || require('../assets/Logo.png');
}