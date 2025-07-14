import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import axiosInstance from "services/axios";

// Estado inicial
const initialState = {
  remainingLikes: 3,
  likesCount: {},
  isLoading: false,
  lastFetch: null,
  error: null,
};

// Actions
const ACTIONS = {
  SET_REMAINING_LIKES: "SET_REMAINING_LIKES",
  UPDATE_LIKE_COUNT: "UPDATE_LIKE_COUNT",
  DECREMENT_REMAINING: "DECREMENT_REMAINING",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  RESET_ERROR: "RESET_ERROR",
};

// Reducer
function sparkReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_REMAINING_LIKES:
      return {
        ...state,
        remainingLikes: action.payload,
        lastFetch: Date.now(),
        isLoading: false,
        error: null,
      };

    case ACTIONS.UPDATE_LIKE_COUNT:
      return {
        ...state,
        likesCount: {
          ...state.likesCount,
          [action.payload.ideaId]: action.payload.count,
        },
      };

    case ACTIONS.DECREMENT_REMAINING:
      return {
        ...state,
        remainingLikes: Math.max(0, state.remainingLikes - 1),
      };

    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case ACTIONS.RESET_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
}

// Context
const SparkContext = createContext();

// Provider Component
export function SparkProvider({ children, userId }) {
  const [state, dispatch] = useReducer(sparkReducer, initialState);

  // Cache de 30 segundos para evitar requisições desnecessárias
  const CACHE_DURATION = 30000;

  // Fetch otimizado com cache
  const fetchRemainingLikes = useCallback(
    async (forceRefresh = false) => {
      // Verificar cache
      if (
        !forceRefresh &&
        state.lastFetch &&
        Date.now() - state.lastFetch < CACHE_DURATION
      ) {
        return state.remainingLikes;
      }

      if (state.isLoading) return state.remainingLikes;

      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: ACTIONS.RESET_ERROR });

      try {
        const response = await axiosInstance.get(`/users/${userId}/stats`);

        if (response.status === 200) {
          const { dailyLikesUsed } = response.data;
          const remaining = Math.max(3 - dailyLikesUsed, 0);

          dispatch({ type: ACTIONS.SET_REMAINING_LIKES, payload: remaining });
          return remaining;
        }
      } catch (error) {
        console.error("Erro ao buscar sparks restantes:", error);
        dispatch({
          type: ACTIONS.SET_ERROR,
          payload: "Erro ao carregar sparks",
        });
      }

      return state.remainingLikes;
    },
    [userId, state.lastFetch, state.isLoading, state.remainingLikes],
  );

  // Atualização otimista de likes
  const handleLike = useCallback(
    async (ideaId) => {
      if (state.remainingLikes <= 0) {
        throw new Error("Você já utilizou todos os seus sparks diários.");
      }

      // Atualização otimista imediata
      dispatch({ type: ACTIONS.DECREMENT_REMAINING });

      const currentCount = state.likesCount[ideaId] || 0;
      dispatch({
        type: ACTIONS.UPDATE_LIKE_COUNT,
        payload: { ideaId, count: currentCount + 1 },
      });

      try {
        const response = await axiosInstance.post("/spark/like-idea", {
          ideaId,
          userId,
        });

        if (response.status === 200) {
          // Confirmar contagem real do servidor
          dispatch({
            type: ACTIONS.UPDATE_LIKE_COUNT,
            payload: { ideaId, count: response.data.likesCount },
          });

          return response.data.likesCount;
        }
      } catch (error) {
        // Rollback em caso de erro
        dispatch({
          type: ACTIONS.UPDATE_LIKE_COUNT,
          payload: { ideaId, count: currentCount },
        });

        // Restaurar spark
        dispatch({
          type: ACTIONS.SET_REMAINING_LIKES,
          payload: state.remainingLikes + 1,
        });

        throw error;
      }
    },
    [userId, state.remainingLikes, state.likesCount],
  );

  // Atualizar contagem de likes
  const updateLikeCount = useCallback((ideaId, count) => {
    dispatch({
      type: ACTIONS.UPDATE_LIKE_COUNT,
      payload: { ideaId, count },
    });
  }, []);

  // Fetch inicial
  useEffect(() => {
    if (userId) {
      fetchRemainingLikes();
    }
  }, [userId, fetchRemainingLikes]);

  const value = {
    ...state,
    fetchRemainingLikes,
    handleLike,
    updateLikeCount,
  };

  return (
    <SparkContext.Provider value={value}>{children}</SparkContext.Provider>
  );
}

// Hook customizado
export function useSpark() {
  const context = useContext(SparkContext);
  if (!context) {
    throw new Error("useSpark deve ser usado dentro de SparkProvider");
  }
  return context;
}
