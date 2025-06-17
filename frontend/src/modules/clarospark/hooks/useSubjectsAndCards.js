import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Pusher from "pusher-js";
import axiosInstance from "services/axios";
import { useLikes } from "./useLikes";

/**
 * Hook principal para gerenciar setores e cards do Spark
 * Implementa WebSocket em tempo real para todas as operações (adicionar, editar, likes)
 * Otimizado para performance com memoização adequada
 */
export function useSubjectsAndCards() {
  // Estados principais
  const [subjects, setSubjects] = useState([]);
  const [cards, setCards] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs para evitar re-renders desnecessários
  const pusherRef = useRef(null);
  const channelRef = useRef(null);
  const { updateLikeCount } = useLikes();

  /**
   * Atualiza likes de um card específico de forma otimizada
   * Memoizado para evitar re-criação desnecessária
   */
  const updateCardLikes = useCallback(
    (ideaId, newLikesCount, userId, isLiked) => {
      setCards((prevCards) => {
        const updatedCards = { ...prevCards };
        let cardFound = false;

        // Busca eficiente: para quando encontrar o card
        for (const subject in updatedCards) {
          const cardIndex = updatedCards[subject].findIndex(
            (card) => card._id === ideaId,
          );

          if (cardIndex !== -1) {
            const currentCard = updatedCards[subject][cardIndex];

            // Atualização otimizada: só modifica se necessário
            updatedCards[subject] = [...updatedCards[subject]];
            updatedCards[subject][cardIndex] = {
              ...currentCard,
              likesCount: newLikesCount,
              likedBy: isLiked
                ? currentCard.likedBy.filter((id) => id !== userId)
                : [...currentCard.likedBy, userId],
            };

            cardFound = true;
            break;
          }
        }

        return cardFound ? updatedCards : prevCards;
      });
    },
    [],
  );

  /**
   * Atualiza um card editado, incluindo mudança de setor
   * Memoizado para performance
   */
  const updateEditedCard = useCallback((updatedIdea, previousData) => {
    setCards((prevCards) => {
      const newCards = { ...prevCards };
      const { subject: newSubject } = updatedIdea;
      const { subject: oldSubject } = previousData;

      // 1. Remove da coluna antiga (se necessário)
      if (oldSubject && newCards[oldSubject]) {
        newCards[oldSubject] = newCards[oldSubject].filter(
          (card) => card._id !== updatedIdea._id,
        );
      }

      // 2. Adiciona/Atualiza na nova coluna
      if (!newCards[newSubject]) {
        newCards[newSubject] = [];
      }

      const existingIndex = newCards[newSubject].findIndex(
        (card) => card._id === updatedIdea._id,
      );

      if (existingIndex !== -1) {
        // Atualiza card existente na mesma coluna
        newCards[newSubject][existingIndex] = {
          ...newCards[newSubject][existingIndex],
          ...updatedIdea,
        };
      } else {
        // Adiciona em nova coluna
        newCards[newSubject].push(updatedIdea);
      }

      return newCards;
    });
  }, []);

  /**
   * Remove um card deletado
   * Memoizado para performance
   */
  const removeDeletedCard = useCallback((ideaId, subject) => {
    setCards((prevCards) => {
      if (!prevCards[subject]) return prevCards;

      const updatedCards = { ...prevCards };
      updatedCards[subject] = updatedCards[subject].filter(
        (card) => card._id !== ideaId,
      );

      return updatedCards;
    });
  }, []);

  /**
   * Cards ordenados por likes e data de criação
   * Memoizado para evitar re-ordenação desnecessária
   */
  const sortedCards = useMemo(() => {
    const sorted = {};

    for (const subject in cards) {
      if (cards[subject]?.length > 0) {
        sorted[subject] = [...cards[subject]].sort((a, b) => {
          // Primeiro por número de likes (decrescente)
          const likeDiff = (b.likedBy?.length || 0) - (a.likedBy?.length || 0);

          // Se empate, por data de criação (mais recente primeiro)
          if (likeDiff === 0) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }

          return likeDiff;
        });
      } else {
        sorted[subject] = [];
      }
    }

    return sorted;
  }, [cards]);

  /**
   * Configuração e limpeza do Pusher
   * Memoizado para evitar reconexões desnecessárias
   */
  const setupPusherConnection = useCallback(() => {
    // Limpar conexão anterior se existir
    if (channelRef.current) {
      channelRef.current.unbind_all();
      pusherRef.current?.unsubscribe("claro-spark");
    }

    // Criar nova conexão
    pusherRef.current = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: process.env.REACT_APP_PUSHER_CLUSTER,
    });

    channelRef.current = pusherRef.current.subscribe("claro-spark");

    // Event listeners otimizados

    // Nova ideia adicionada
    channelRef.current.bind("new-idea", (data) => {
      if (data?.card) {
        setCards((prevCards) => ({
          ...prevCards,
          [data.card.subject]: [
            ...(prevCards[data.card.subject] || []),
            data.card,
          ],
        }));
      }
    });

    // Ideia editada - NOVO EVENT LISTENER

    // Likes atualizados
    channelRef.current.bind("idea-edited", (data) => {
      if (data?.ideaId && data?.updatedFields && data?.previousSubject) {
        setCards((prevCards) => {
          const updatedCards = { ...prevCards };
          const { ideaId, updatedFields, previousSubject } = data;
          const { subject: newSubject } = updatedFields;

          // 1. Encontrar o card no estado atual
          let foundCard = null;
          let foundSubject = null;

          // Verificar no setor anterior primeiro
          if (updatedCards[previousSubject]) {
            const cardIndex = updatedCards[previousSubject].findIndex(
              (card) => card._id === ideaId,
            );

            if (cardIndex !== -1) {
              foundCard = updatedCards[previousSubject][cardIndex];
              foundSubject = previousSubject;
            }
          }

          // Se não encontrou, procurar em todos os setores
          if (!foundCard) {
            for (const subject in updatedCards) {
              const cardIndex = updatedCards[subject].findIndex(
                (card) => card._id === ideaId,
              );

              if (cardIndex !== -1) {
                foundCard = updatedCards[subject][cardIndex];
                foundSubject = subject;
                break;
              }
            }
          }

          if (!foundCard) {
            console.warn("Card não encontrado para atualização", ideaId);
            return prevCards;
          }

          // 2. Atualizar o card com os novos campos
          const updatedCard = {
            ...foundCard,
            ...updatedFields,
          };

          // 3. Mover entre setores se necessário
          if (foundSubject !== newSubject) {
            // Remover do setor antigo
            updatedCards[foundSubject] = updatedCards[foundSubject].filter(
              (card) => card._id !== ideaId,
            );

            // Adicionar ao novo setor
            if (!updatedCards[newSubject]) {
              updatedCards[newSubject] = [];
            }
            updatedCards[newSubject].push(updatedCard);
          } else {
            // Atualizar no mesmo setor
            updatedCards[foundSubject] = updatedCards[foundSubject].map(
              (card) => (card._id === ideaId ? updatedCard : card),
            );
          }

          return updatedCards;
        });
      }
    });

    // Status alterado (para gestores)
    channelRef.current.bind("status-changed", (data) => {
      if (data?.idea) {
        setCards((prevCards) => {
          const newCards = { ...prevCards };
          const { subject } = data.idea;

          if (newCards[subject]) {
            newCards[subject] = newCards[subject].map((card) =>
              card._id === data.idea._id ? data.idea : card,
            );
          }

          return newCards;
        });
      }
    });

    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
      }
      if (pusherRef.current) {
        pusherRef.current.unsubscribe("claro-spark");
        pusherRef.current.disconnect();
      }
    };
  }, [updateCardLikes, updateEditedCard, removeDeletedCard, updateLikeCount]);

  /**
   * Carregamento inicial dos dados
   * Otimizado com Promise.all para requisições paralelas
   */
  useEffect(() => {
    let isMounted = true; // Flag para evitar state updates em componente desmontado

    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Requisições paralelas para melhor performance
        const [subjectsResponse, cardsResponse] = await Promise.all([
          axiosInstance.get("/spark/subjects"),
          axiosInstance.get("/spark/ideas"),
        ]);

        // Verificar se o componente ainda está montado
        if (!isMounted) return;

        if (subjectsResponse.status === 200 && cardsResponse.status === 200) {
          const fetchedSubjects = subjectsResponse.data.map(
            (subject) => subject.nome,
          );

          setSubjects(fetchedSubjects);

          // Organizar cards por setor de forma eficiente
          const organizedCards = fetchedSubjects.reduce((acc, subject) => {
            acc[subject] = cardsResponse.data.filter(
              (card) => card.subject === subject,
            );
            return acc;
          }, {});

          setCards(organizedCards);
        }
      } catch (error) {
        console.error("Erro ao buscar dados iniciais:", error);

        if (isMounted) {
          setError(
            "Falha ao carregar os dados. Por favor, tente novamente mais tarde.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchInitialData();

    // Configurar WebSocket após carregamento inicial
    const cleanupPusher = setupPusherConnection();

    // Cleanup function
    return () => {
      isMounted = false;
      cleanupPusher();
    };
  }, [setupPusherConnection]);

  return {
    subjects,
    sortedCards,
    isLoading,
    error,
  };
}
