import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export const registerUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = {
      uid: user.uid,
      email: email,
      ...userData,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
      ativo: true
    };

    await setDoc(doc(db, "users", user.uid), userDoc);

    return { success: true, user: userDoc };
  } catch (error) {
    console.error("Erro no cadastro:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (userDoc.exists()) {
      return { success: true, user: userDoc.data() };
    } else {
      throw new Error("Dados do usuário não encontrados");
    }
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Erro no logout:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updatedData) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      ...updatedData,
      atualizadoEm: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
};