import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";

export async function addUser(userId, userData, db) {
  try {
    console.log("Tentando adicionar usuário...");
    console.log("UserID:", userId);
    console.log("UserData:", userData);
    console.log("DB:", db ? "Definido" : "Indefinido");
    
    await setDoc(doc(db, "users", userId), userData);
    console.log("Usuário adicionado com sucesso no Firestore");
  } catch (error) {
    console.error("Erro detalhado ao adicionar usuário:");
    console.error("Código do erro:", error.code);
    console.error("Mensagem:", error.message);
    console.error("Detalhes:", error.details);
    throw error;
  }
}

export async function getUsers(db) { 
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
}

export async function addLogin(db, cpfCnpj, timestamp) {
  try {
    console.log("Adicionando login no Firestore...");
    const result = await addDoc(collection(db, "logins"), { 
      cpfCnpj, 
      timestamp 
    });
    console.log("Login registrado com sucesso");
    return result;
  } catch (error) {
    console.error("Erro ao adicionar login:", error);
    throw error;
  }
}