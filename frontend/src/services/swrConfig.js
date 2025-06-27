import { SWRConfig } from "swr";
import axiosInstance from "./axios";

// Fetcher function que usa o axiosInstance configurado
const fetcher = async (url) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    // Propaga o erro para que o SWR possa tratá-lo adequadamente
    throw error;
  }
};

// Configuração global do SWR
export const swrConfig = {
  fetcher,
  // Cache por 5 minutos (300 segundos)
  dedupingInterval: 30000,
  // Revalidar quando a janela ganha foco
  revalidateOnFocus: true,
  // Revalidar quando reconecta à internet
  revalidateOnReconnect: true,
  // Não revalidar automaticamente ao montar (evita requisições desnecessárias)
  revalidateOnMount: true,
  // Intervalo de revalidação em background (10 minutos)
  refreshInterval: 60000,
  // Configurações de retry
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  // Configurações de timeout
  loadingTimeout: 10000,
  // Configuração para comparação de dados (evita re-renders desnecessários)
  compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  // Configuração de erro
  onError: (error, key) => {
    console.error(`SWR Error for key ${key}:`, error);
    // Aqui você pode adicionar logging ou notificações de erro
  },
  // Configuração de sucesso
  onSuccess: (data, key) => {
    // Log opcional para debug
    // console.log(`SWR Success for key ${key}:`, data);
  },
};

// Provider component para envolver a aplicação
export function SWRProvider({ children }) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}

// Utilitários para keys do SWR
export const SWR_KEYS = {
  USERS: "/users",
  USERS_BY_ASSIGNMENT: (assignmentId) =>
    `/flow/assignments/${assignmentId}/users/`,
  USER_ASSIGNMENTS: (userId) => `/flow/user/${userId}/assignments`,
  MANAGERS: "/users/managers",
  USER_STATS: (userId) => `/users/${userId}/stats`,
  USER_AVATAR: (userId) => `/users/${userId}/avatar`,
};

// Função helper para invalidar cache específico
export const invalidateCache = (mutate, key) => {
  return mutate(key);
};

// Função helper para invalidar múltiplas keys
export const invalidateMultipleKeys = (mutate, keys) => {
  return Promise.all(keys.map((key) => mutate(key)));
};
