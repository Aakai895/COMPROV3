import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../config';
export const getUserBasicData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: "Usuário não encontrado" };
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return { success: false, error: error.message };
  }
};

export const updateUserBasicData = async (userId, updatedData) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      ...updatedData,
      atualizadoEm: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return { success: false, error: error.message };
  }
};

export const getUserByEmail = async (email) => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: "Usuário não encontrado" };
    }
  } catch (error) {
    console.error("Erro ao buscar usuário por email:", error);
    return { success: false, error: error.message };
  }
};

export const getPacienteData = async (userId) => {
  try {
    const pacienteDoc = await getDoc(doc(db, "pacientes", userId));
    if (pacienteDoc.exists()) {
      return { success: true, data: pacienteDoc.data() };
    } else {
      return { success: false, error: "Paciente não encontrado" };
    }
  } catch (error) {
    console.error("Erro ao buscar paciente:", error);
    return { success: false, error: error.message };
  }
};

export const updatePacienteData = async (userId, updatedData) => {
  try {
    await updateDoc(doc(db, "pacientes", userId), {
      ...updatedData,
      atualizadoEm: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    return { success: false, error: error.message };
  }
};

export const addEmocaoPaciente = async (userId, emocaoData) => {
  try {
    const pacienteRef = doc(db, "pacientes", userId);
    const pacienteDoc = await getDoc(pacienteRef);
    
    if (pacienteDoc.exists()) {
      const currentData = pacienteDoc.data();
      const novasEmocoes = [...(currentData.emocoesRegistradas || []), {
        id: new Date().getTime().toString(),
        ...emocaoData,
        registradoEm: new Date()
      }];
      
      await updateDoc(pacienteRef, {
        emocoesRegistradas: novasEmocoes,
        atualizadoEm: new Date()
      });
      
      return { success: true };
    } else {
      return { success: false, error: "Paciente não encontrado" };
    }
  } catch (error) {
    console.error("Erro ao adicionar emoção:", error);
    return { success: false, error: error.message };
  }
};

export const getEmocoesPaciente = async (userId, limite = 10) => {
  try {
    const pacienteDoc = await getDoc(doc(db, "pacientes", userId));
    if (pacienteDoc.exists()) {
      const data = pacienteDoc.data();
      const emocoes = data.emocoesRegistradas || [];
      const emocoesOrdenadas = emocoes
        .sort((a, b) => new Date(b.registradoEm) - new Date(a.registradoEm))
        .slice(0, limite);
      
      return { success: true, data: emocoesOrdenadas };
    } else {
      return { success: false, error: "Paciente não encontrado" };
    }
  } catch (error) {
    console.error("Erro ao buscar emoções:", error);
    return { success: false, error: error.message };
  }
};


export const getEmpresaData = async (userId) => {
  try {
    const empresaDoc = await getDoc(doc(db, "empresas", userId));
    if (empresaDoc.exists()) {
      return { success: true, data: empresaDoc.data() };
    } else {
      return { success: false, error: "Empresa não encontrada" };
    }
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);
    return { success: false, error: error.message };
  }
};

export const updateEmpresaData = async (userId, updatedData) => {
  try {
    await updateDoc(doc(db, "empresas", userId), {
      ...updatedData,
      atualizadoEm: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar empresa:", error);
    return { success: false, error: error.message };
  }
};

export const addServicoEmpresa = async (userId, servicoData) => {
  try {
    const empresaRef = doc(db, "empresas", userId);
    const empresaDoc = await getDoc(empresaRef);
    
    if (empresaDoc.exists()) {
      const currentData = empresaDoc.data();
      const novosServicos = [...(currentData.servicosOferecidos || []), {
        id: new Date().getTime().toString(),
        ...servicoData,
        criadoEm: new Date()
      }];
      
      await updateDoc(empresaRef, {
        servicosOferecidos: novosServicos,
        atualizadoEm: new Date()
      });
      
      return { success: true };
    } else {
      return { success: false, error: "Empresa não encontrada" };
    }
  } catch (error) {
    console.error("Erro ao adicionar serviço:", error);
    return { success: false, error: error.message };
  }
};
export const getClinicaData = async (userId) => {
  try {
    const clinicaDoc = await getDoc(doc(db, "clinicas", userId));
    if (clinicaDoc.exists()) {
      return { success: true, data: clinicaDoc.data() };
    } else {
      return { success: false, error: "Clínica não encontrada" };
    }
  } catch (error) {
    console.error("Erro ao buscar clínica:", error);
    return { success: false, error: error.message };
  }
};

export const updateClinicaData = async (userId, updatedData) => {
  try {
    await updateDoc(doc(db, "clinicas", userId), {
      ...updatedData,
      atualizadoEm: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar clínica:", error);
    return { success: false, error: error.message };
  }
};

export const addConvenioClinica = async (userId, convenioData) => {
  try {
    const clinicaRef = doc(db, "clinicas", userId);
    const clinicaDoc = await getDoc(clinicaRef);
    
    if (clinicaDoc.exists()) {
      const currentData = clinicaDoc.data();
      const novosConvenios = [...(currentData.convenios || []), {
        id: new Date().getTime().toString(),
        ...convenioData,
        adicionadoEm: new Date()
      }];
      
      await updateDoc(clinicaRef, {
        convenios: novosConvenios,
        atualizadoEm: new Date()
      });
      
      return { success: true };
    } else {
      return { success: false, error: "Clínica não encontrada" };
    }
  } catch (error) {
    console.error("Erro ao adicionar convênio:", error);
    return { success: false, error: error.message };
  }
};

export const addProfissionalClinica = async (userId, profissionalData) => {
  try {
    const clinicaRef = doc(db, "clinicas", userId);
    const clinicaDoc = await getDoc(clinicaRef);
    
    if (clinicaDoc.exists()) {
      const currentData = clinicaDoc.data();
      const novosProfissionais = [...(currentData.profissionais || []), {
        id: new Date().getTime().toString(),
        ...profissionalData,
        adicionadoEm: new Date()
      }];
      
      await updateDoc(clinicaRef, {
        profissionais: novosProfissionais,
        atualizadoEm: new Date()
      });
      
      return { success: true };
    } else {
      return { success: false, error: "Clínica não encontrada" };
    }
  } catch (error) {
    console.error("Erro ao adicionar profissional:", error);
    return { success: false, error: error.message };
  }
};

export const getPerfilCompleto = async (userId) => {
  try {
    const userResult = await getUserBasicData(userId);
    if (!userResult.success) {
      return userResult;
    }

    const userData = userResult.data;
    const tipoUsuario = userData.tipo;

    let dadosEspecificos = {};
    
    switch(tipoUsuario) {
      case 'paciente':
        const pacienteResult = await getPacienteData(userId);
        if (pacienteResult.success) {
          dadosEspecificos = pacienteResult.data;
        }
        break;
        
      case 'empresa':
        const empresaResult = await getEmpresaData(userId);
        if (empresaResult.success) {
          dadosEspecificos = empresaResult.data;
        }
        break;
        
      case 'clinica':
        const clinicaResult = await getClinicaData(userId);
        if (clinicaResult.success) {
          dadosEspecificos = clinicaResult.data;
        }
        break;
    }

    const perfilCompleto = {
      ...userData,
      ...dadosEspecificos
    };

    return { success: true, data: perfilCompleto };

  } catch (error) {
    console.error("Erro ao buscar perfil completo:", error);
    return { success: false, error: error.message };
  }
};

export const updateUltimoAcesso = async (userId) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      ultimoAcesso: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar último acesso:", error);
    return { success: false, error: error.message };
  }
};

export const getUsersByType = async (tipoUsuario) => {
  try {
    const q = query(collection(db, "users"), where("tipo", "==", tipoUsuario));
    const querySnapshot = await getDocs(q);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: users };
  } catch (error) {
    console.error("Erro ao buscar usuários por tipo:", error);
    return { success: false, error: error.message };
  }
};

export const checkPerfilCompleto = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return { 
        success: true, 
        data: { 
          perfilCompleto: userData.perfilCompleto || false,
          camposFaltantes: [] 
        }
      };
    } else {
      return { success: false, error: "Usuário não encontrado" };
    }
  } catch (error) {
    console.error("Erro ao verificar perfil:", error);
    return { success: false, error: error.message };
  }
};