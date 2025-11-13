// services/AuthFirebase.js - Adicione estas funções

import { 
  authUsuarios, 
  authEmpresas, 
  authClinicas,
  dbUsuarios,
  dbEmpresas, 
  dbClinicas
} from "./firebaseConfig";

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  updatePassword 
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// ... (suas funções existentes permanecem aqui) ...

// Função para enviar email de recuperação de senha
export async function sendPasswordReset(email) {
  try {
    console.log("Tentando enviar email de recuperação para:", email);
    
    // Tentar encontrar em qual auth o email existe
    const authInstances = [
      { auth: authUsuarios, type: 'usuário' },
      { auth: authEmpresas, type: 'empresa' },
      { auth: authClinicas, type: 'clínica' }
    ];

    let emailFound = false;
    
    for (const instance of authInstances) {
      try {
        await sendPasswordResetEmail(instance.auth, email);
        console.log(`Email de recuperação enviado para ${instance.type}`);
        emailFound = true;
        break; // Para no primeiro sucesso
      } catch (error) {
        console.log(`Email não encontrado em ${instance.type}:`, error.code);
        continue;
      }
    }

    if (!emailFound) {
      throw new Error('EMAIL_NOT_FOUND');
    }

    return { success: true, message: 'Email de recuperação enviado com sucesso!' };
  } catch (error) {
    console.error('Erro ao enviar email de recuperação:', error);
    
    if (error.message === 'EMAIL_NOT_FOUND') {
      throw new Error('Email não encontrado em nosso sistema.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Email inválido.');
    } else {
      throw new Error('Erro ao enviar email de recuperação. Tente novamente.');
    }
  }
}

// Função para atualizar senha (após verificação do código)
export async function updateUserPassword(email, newPassword) {
  try {
    console.log("Atualizando senha para:", email);
    
    // Tentar fazer login para verificar credenciais e depois atualizar
    const authInstances = [
      { auth: authUsuarios, type: 'usuário', db: dbUsuarios, collection: 'users' },
      { auth: authEmpresas, type: 'empresa', db: dbEmpresas, collection: 'empresas' },
      { auth: authClinicas, type: 'clínica', db: dbClinicas, collection: 'clinicas' }
    ];

    let updateSuccess = false;
    
    for (const instance of authInstances) {
      try {
        // Primeiro tentar fazer login (para verificar se o usuário existe)
        const userCredential = await signInWithEmailAndPassword(instance.auth, email, 'tempPassword');
        
        // Se chegou aqui, o usuário existe - agora atualizar a senha
        await updatePassword(userCredential.user, newPassword);
        console.log(`Senha atualizada para ${instance.type}:`, email);
        
        // Atualizar timestamp no Firestore
        await updateDoc(doc(instance.db, instance.collection, userCredential.user.uid), {
          passwordUpdatedAt: new Date()
        });
        
        updateSuccess = true;
        break;
      } catch (loginError) {
        console.log(`Não é ${instance.type} ou senha temporária incorreta:`, loginError.code);
        continue;
      }
    }

    if (!updateSuccess) {
      throw new Error('USER_NOT_FOUND');
    }

    return { success: true, message: 'Senha atualizada com sucesso!' };
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    
    if (error.message === 'USER_NOT_FOUND') {
      throw new Error('Usuário não encontrado.');
    } else {
      throw new Error('Erro ao atualizar senha. Tente novamente.');
    }
  }
}

// Função alternativa mais simples - apenas envia email de reset
export async function simplePasswordReset(email) {
  try {
    console.log("Enviando email de reset para:", email);
    
    // Ordem de tentativa: Usuário → Empresa → Clínica
    const authAttempts = [
      { auth: authUsuarios, type: 'usuário' },
      { auth: authEmpresas, type: 'empresa' },
      { auth: authClinicas, type: 'clínica' }
    ];

    for (const attempt of authAttempts) {
      try {
        await sendPasswordResetEmail(attempt.auth, email);
        console.log(`Email de reset enviado para ${attempt.type}:`, email);
        return { 
          success: true, 
          message: 'Email de recuperação enviado! Verifique sua caixa de entrada.',
          userType: attempt.type
        };
      } catch (error) {
        console.log(`Não é ${attempt.type}:`, error.code);
        continue;
      }
    }

    throw new Error('EMAIL_NOT_FOUND');
  } catch (error) {
    console.error('Erro no simplePasswordReset:', error);
    
    if (error.message === 'EMAIL_NOT_FOUND') {
      throw new Error('Este email não está cadastrado em nosso sistema.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Por favor, insira um email válido.');
    } else if (error.code === 'auth/user-not-found') {
      throw new Error('Este email não está cadastrado.');
    } else {
      throw new Error('Erro ao enviar email de recuperação. Tente novamente.');
    }
  }
}