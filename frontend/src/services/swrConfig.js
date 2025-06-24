import { SWRConfig } from "swr";
import axiosInstance from "services/axios";

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
  // Cache por 30 segundos para dados de dashboard que mudam frequentemente
  dedupingInterval: 30000,
  // Revalidar quando a janela ganha foco - desabilitado para evitar requisições excessivas
  revalidateOnFocus: false,
  // Revalidar quando reconecta à internet
  revalidateOnReconnect: true,
  // Revalidar automaticamente ao montar
  revalidateOnMount: true,
  // Intervalo de revalidação em background (5 minutos para dados de KPI)
  refreshInterval: 300000,
  // Configurações de retry
  errorRetryCount: 3,
  errorRetryInterval: 2000,
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
  // NetFacil keys
  NETFACIL_DATA: "/netsmsfacil",
  NETFACIL_SGD: "/netfacilsgd",
  // Notifications keys
  NOTIFICATIONS: (userId) => `/notifications/${userId}`,
  NOTIFICATIONS_MARK_ALL_READ: (userId) =>
    `/notifications/${userId}/mark-all-read`,
  NOTIFICATIONS_HIDE_ALL: (userId) => `/notifications/${userId}/hide-all`,
  NOTIFICATION_HIDE: (notificationId) =>
    `/notifications/${notificationId}/hide`,
  // KPI/Insights keys
  KPI_AVERAGE_TIME: (params) => {
    const { period, userId, projectId, assignmentId } = params;
    const queryParams = new URLSearchParams();
    if (period) queryParams.append("period", period);
    if (userId) queryParams.append("userId", userId);
    if (projectId) queryParams.append("projectId", projectId);
    if (assignmentId) queryParams.append("assignmentId", assignmentId);
    return `/insights/kpi/average-time?${queryParams.toString()}`;
  },
  KPI_TEAM_VOLUME: (params) => {
    const { period, projectId, assignmentId } = params;
    const queryParams = new URLSearchParams();
    if (period) queryParams.append("period", period);
    if (projectId) queryParams.append("projectId", projectId);
    if (assignmentId) queryParams.append("assignmentId", assignmentId);
    return `/insights/kpi/team-volume?${queryParams.toString()}`;
  },
  KPI_TEAM_PERFORMANCE: (params) => {
    const { period, projectId, assignmentId } = params;
    const queryParams = new URLSearchParams();
    if (period) queryParams.append("period", period);
    if (projectId) queryParams.append("projectId", projectId);
    if (assignmentId) queryParams.append("assignmentId", assignmentId);
    return `/insights/kpi/team-performance?${queryParams.toString()}`;
  },
  KPI_INDIVIDUAL_RADAR: (params) => {
    const { period, userId, projectId, assignmentId } = params;
    const queryParams = new URLSearchParams();
    if (period) queryParams.append("period", period);
    if (userId) queryParams.append("userId", userId);
    if (projectId) queryParams.append("projectId", projectId);
    if (assignmentId) queryParams.append("assignmentId", assignmentId);
    return `/insights/kpi/individual-radar?${queryParams.toString()}`;
  },
};

// Função helper para invalidar cache específico
export const invalidateCache = (mutate, key) => {
  return mutate(key);
};

// Função helper para invalidar múltiplas keys
export const invalidateMultipleKeys = (mutate, keys) => {
  return Promise.all(keys.map((key) => mutate(key)));
};

// Função helper para invalidar cache de KPI
export const invalidateKPICache = (mutate, params) => {
  const keys = [
    SWR_KEYS.KPI_AVERAGE_TIME(params),
    SWR_KEYS.KPI_TEAM_VOLUME(params),
    SWR_KEYS.KPI_TEAM_PERFORMANCE(params),
    SWR_KEYS.KPI_INDIVIDUAL_RADAR(params),
  ];
  return invalidateMultipleKeys(mutate, keys);
};
