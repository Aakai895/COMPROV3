import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxe-O2bdQ19Yo8N1Rqf_2eJpfUIk9LnTE",
  authDomain: "compro-d8507.firebaseapp.com",
  databaseURL: "https://compro-d8507-default-rtdb.firebaseio.com",
  projectId: "compro-d8507",
  storageBucket: "compro-d8507.firebasestorage.app",
  messagingSenderId: "378462570464",
  appId: "1:378462570464:web:75f4e635890685e234cd85"
};

const firebaseCLIConfig= {
  apiKey: "AIzaSyCqScXA_H8xl63hd9UUxLdt1ho2TNJ47_8",
  authDomain: "comproclinica-3b64c.firebaseapp.com",
  databaseURL: "https://comproclinica-3b64c-default-rtdb.firebaseio.com",
  projectId: "comproclinica-3b64c",
  storageBucket: "comproclinica-3b64c.firebasestorage.app",
  messagingSenderId: "383325628727",
  appId: "1:383325628727:web:f2128f75103b6716b6d2b2"
};

const firebaseEMPConfig= {
  apiKey: "AIzaSyCvH7CNe-iEg-Mymfj_QL6hM7ioIefKYFA",
  authDomain: "comproem-f38d3.firebaseapp.com",
  databaseURL: "https://comproem-f38d3-default-rtdb.firebaseio.com",
  projectId: "comproem-f38d3",
  storageBucket: "comproem-f38d3.firebasestorage.app",
  messagingSenderId: "230361686459",
  appId: "1:230361686459:web:b1609176fe81d20f02a49e"
};

const appUsuarios =
  getApps().find(app => app.name === "usuariosApp") ||
  initializeApp(firebaseConfig, "usuariosApp");

const appEmpresas =
  getApps().find(app => app.name === "empresasApp") ||
  initializeApp(firebaseEMPConfig, "empresasApp");

const appClinicas =
  getApps().find(app => app.name === "clinicasApp") ||
  initializeApp(firebaseCLIConfig, "clinicasApp");

export const authUsuarios = getAuth(appUsuarios);
export const dbUsuarios = getFirestore(appUsuarios);

export const authEmpresas = getAuth(appEmpresas);
export const dbEmpresas = getFirestore(appEmpresas);

export const authClinicas = getAuth(appClinicas);
export const dbClinicas = getFirestore(appClinicas);

