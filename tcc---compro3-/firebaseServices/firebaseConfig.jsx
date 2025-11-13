import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHiKtYvtGunTxOcflsPzJ9GfwQeCbm4ao",

  authDomain: "compro-us.firebaseapp.com",

  databaseURL: "https://compro-us-default-rtdb.firebaseio.com",

  projectId: "compro-us",

  storageBucket: "compro-us.firebasestorage.app",

  messagingSenderId: "125140115870",

  appId: "1:125140115870:web:938c0d9eba98bf0f84768f"

};

const firebaseCLIConfig= {
  apiKey: "AIzaSyBe9wx45uZcOLJde5tnTvGFvK0wsX56CGU",

  authDomain: "compro-cli.firebaseapp.com",

  databaseURL: "https://compro-cli-default-rtdb.firebaseio.com",

  projectId: "compro-cli",

  storageBucket: "compro-cli.firebasestorage.app",

  messagingSenderId: "235790622556",

  appId: "1:235790622556:web:e2eec3b06b27cd8dbf6b99"

};

const firebaseEMPConfig= {
  apiKey: "AIzaSyCrt1bFQBDd6_MuiXlg-IehzXmBYqsC49c",

  authDomain: "compro-emp.firebaseapp.com",

  databaseURL: "https://compro-emp-default-rtdb.firebaseio.com",

  projectId: "compro-emp",

  storageBucket: "compro-emp.firebasestorage.app",

  messagingSenderId: "1097391045132",

  appId: "1:1097391045132:web:47da38fbb7c91bc05c0c29"
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

