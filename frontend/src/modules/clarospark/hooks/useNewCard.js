import { useState, useEffect, useCallback, useMemo } from "react";
import useNotifications from "modules/shared/hooks/useNotifications";
import axiosInstance from "services/axios";

/**
 * Hook otimizado para gerenciar criação e edição de cards
 * Implementa memoização e callbacks otimizados para melhor performance
 */
export function useNewCard(subjects = [], userId, initialIdea = null) {
  const { createGlobalNotification } = useNotifications();

  // Template padrão para novos cards - memoizado para evitar re-criação
  const defaultCardTemplate = useMemo(
    () => ({
      title: "",
      description: "",
      subject: subjects[0] || "",
      likesCount: 0,
      status: "Em Análise",
      likedBy: [],
      anonymous: 0,
    }),
    [subjects],
  );

  // Estados para nova ideia e edição
  const [newCard, setNewCard] = useState(defaultCardTemplate);
  const [editCard, setEditCard] = useState(defaultCardTemplate);

  /**
   * Atualiza template padrão quando subjects mudam
   * Evita bugs quando subjects são carregados assincronamente
   */
  useEffect(() => {
    if (subjects.length > 0 && !newCard.subject) {
      setNewCard((prev) => ({
        ...prev,
        subject: subjects[0],
      }));
    }
  }, [subjects, newCard.subject]);

  /**
   * Inicializa editCard quando initialIdea é fornecida
   * Memoizado para evitar re-inicializações desnecessárias
   */
  useEffect(() => {
    if (initialIdea) {
      const initialEditCard = {
        title: initialIdea.title || "",
        description: initialIdea.description || "",
        subject: initialIdea.subject || subjects[0] || "",
        likesCount: initialIdea.likesCount || 0,
        status: initialIdea.status || "Em Análise",
        likedBy: initialIdea.likedBy || [],
        anonymous: initialIdea.anonymous || 0,
      };

      setEditCard(initialEditCard);
    }
  }, [initialIdea, subjects]);

  /**
   * Reseta newCard para o template padrão
   * Memoizado para performance
   */
  const resetNewCard = useCallback(() => {
    setNewCard(defaultCardTemplate);
  }, [defaultCardTemplate]);

  /**
   * Valida dados do card antes do envio
   * Memoizado para evitar re-criação
   */
  const validateCardData = useCallback((cardData) => {
    const errors = [];

    if (!cardData.title?.trim()) {
      errors.push("Título é obrigatório");
    } else if (cardData.title.trim().length > 50) {
      errors.push("Título deve ter no máximo 50 caracteres");
    }

    if (!cardData.description?.trim()) {
      errors.push("Descrição é obrigatória");
    } else if (cardData.description.trim().length > 1500) {
      errors.push("Descrição deve ter no máximo 1500 caracteres");
    }

    if (!cardData.subject) {
      errors.push("Setor é obrigatório");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, []);

  /**
   * Adiciona novo card com validação e notificação
   * Otimizado com try/catch e logging adequado
   */
  const handleAddCard = useCallback(
    async (cardData) => {
      // Validação dos dados
      const validation = validateCardData(cardData);
      if (!validation.isValid) {
        console.error("useNewCard: Dados inválidos", validation.errors);
        return {
          success: false,
          errors: validation.errors,
        };
      }

      try {
        const response = await axiosInstance.post("/spark/add-idea", {
          ...cardData,
          userId,
        });

        if (response.status === 201) {
          // Reset do formulário
          resetNewCard();

          // Notificação global (não-bloqueante)
          createGlobalNotification(
            "spark",
            "💡 Uma nova ideia foi criada no Spark! Venha conferir.",
          ).catch((error) => {
            console.warn(
              "useNewCard: Erro ao criar notificação (não crítico)",
              error,
            );
          });

          return {
            success: true,
            data: response.data,
          };
        }
      } catch (error) {
        console.error("useNewCard: Erro ao adicionar card", {
          error: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });

        return {
          success: false,
          errors: [error.response?.data?.message || "Erro ao adicionar ideia"],
        };
      }

      return {
        success: false,
        errors: ["Erro inesperado ao adicionar ideia"],
      };
    },
    [userId, validateCardData, resetNewCard, createGlobalNotification],
  );

  /**
   * Atualiza card existente com validação
   * Otimizado com logging e tratamento de erro adequado
   */
  const handleUpdateCard = useCallback(
    async (cardData, ideaId) => {
      if (!ideaId) {
        console.error("useNewCard: ID da ideia não fornecido");
        return {
          success: false,
          errors: ["ID da ideia é obrigatório"],
        };
      }

      // Validação dos dados
      const validation = validateCardData(cardData);
      if (!validation.isValid) {
        console.error(
          "useNewCard: Dados inválidos para atualização",
          validation.errors,
        );
        return {
          success: false,
          errors: validation.errors,
        };
      }

      try {
        const response = await axiosInstance.put(
          `/spark/ideas/${ideaId}`,
          cardData,
        );

        if (response.status === 200) {
          return {
            success: true,
            data: response.data,
          };
        }
      } catch (error) {
        console.error("useNewCard: Erro ao atualizar card", {
          ideaId,
          error: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });

        return {
          success: false,
          errors: [error.response?.data?.message || "Erro ao atualizar ideia"],
        };
      }

      return {
        success: false,
        errors: ["Erro inesperado ao atualizar ideia"],
      };
    },
    [validateCardData],
  );

  /**
   * Setters otimizados com useCallback para evitar re-renders
   */
  const setNewCardOptimized = useCallback((updater) => {
    setNewCard((prev) => {
      const newValue = typeof updater === "function" ? updater(prev) : updater;
      return { ...prev, ...newValue };
    });
  }, []);

  const setEditCardOptimized = useCallback((updater) => {
    setEditCard((prev) => {
      const newValue = typeof updater === "function" ? updater(prev) : updater;
      return { ...prev, ...newValue };
    });
  }, []);

  return {
    // Estados
    newCard,
    editCard,

    // Setters otimizados
    setNewCard: setNewCardOptimized,
    setEditCard: setEditCardOptimized,

    // Ações
    handleAddCard,
    handleUpdateCard,
    resetNewCard,

    // Utilitários
    validateCardData,
  };
}
