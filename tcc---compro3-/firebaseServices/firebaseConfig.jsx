import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Vou usar o primeiro (compro-us) - você pode escolher qualquer um
const firebaseConfig = {
  apiKey: "AIzaSyDHiKtYvtGunTxOcflsPzJ9GfwQeCbm4ao",
  authDomain: "compro-us.firebaseapp.com",
  databaseURL: "https://compro-us-default-rtdb.firebaseio.com",
  projectId: "compro-us",
  storageBucket: "compro-us.firebasestorage.app",
  messagingSenderId: "125140115870",
  appId: "1:125140115870:web:938c0d9eba98bf0f84768f"
};

// Inicializar apenas UMA vez
const app = initializeApp(firebaseConfig);

// Exportar apenas UMA instância de cada
export const auth = getAuth(app);
export const db = getFirestore(app);