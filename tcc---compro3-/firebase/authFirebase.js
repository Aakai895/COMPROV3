import { 
  authUsuarios, 
  authEmpresas, 
  authClinicas,
  dbUsuarios,
  dbEmpresas, 
  dbClinicas
} from "./firebaseConfig";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Funções para Usuários
export async function registerUser(email, password, userData) {
  try {
    console.log("Tentando registrar usuário...");
    const userCredential = await createUserWithEmailAndPassword(authUsuarios, email, password);
    
    // Salvar dados adicionais no Firestore
    await setDoc(doc(dbUsuarios, "users", userCredential.user.uid), {
      ...userData,
      createdAt: new Date(),
      userId: userCredential.user.uid
    });
    
    console.log("Usuário registrado com sucesso:", userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error("Erro no registerUser:", error);
    throw error;
  }
}

export async function loginUser(email, password) {
  return await signInWithEmailAndPassword(authUsuarios, email, password);
}

// Funções para Empresas
export async function registerEmpresa(email, password, empresaData) {
  try {
    const userCredential = await createUserWithEmailAndPassword(authEmpresas, email, password);
    
    await setDoc(doc(dbEmpresas, "empresas", userCredential.user.uid), {
      ...empresaData,
      createdAt: new Date(),
      empresaId: userCredential.user.uid
    });
    
    console.log("Empresa registrada com sucesso:", userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error("Erro no registerEmpresa:", error);
    throw error;
  }
}

export async function loginEmpresa(email, password) {
  return await signInWithEmailAndPassword(authEmpresas, email, password);
}

// Funções para Clínicas
export async function registerClinica(email, password, clinicaData) {
  try {
    const userCredential = await createUserWithEmailAndPassword(authClinicas, email, password);
    
    await setDoc(doc(dbClinicas, "clinicas", userCredential.user.uid), {
      ...clinicaData,
      createdAt: new Date(),
      clinicaId: userCredential.user.uid
    });
    
    console.log("Clínica registrada com sucesso:", userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error("Erro no registerClinica:", error);
    throw error;
  }
}

export async function loginClinica(email, password) {
  return await signInWithEmailAndPassword(authClinicas, email, password);
}

export async function logoutUser() {
  return await signOut(authUsuarios);
}