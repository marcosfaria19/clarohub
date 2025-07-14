import { useCallback } from "react";
import { toast } from "sonner";
import { useSpark } from "./sparkContext";

export function useLikes() {
  const {
    remainingLikes,
    likesCount,
    handleLike: contextHandleLike,
    updateLikeCount,
    error,
  } = useSpark();

  const handleLike = useCallback(
    async (ideaId) => {
      if (remainingLikes <= 0) {
        toast.warning("Você já utilizou todos os seus sparks diários.");
        return;
      }
      try {
        const newCount = await contextHandleLike(ideaId);
        toast.success("Ideia apoiada!");
        return newCount;
      } catch (error) {
        if (error.response?.status === 403) {
          const errorMessage =
            error.response?.data?.message || "Erro ao adicionar spark.";

          if (errorMessage.includes("Você não pode apoiar sua própria ideia")) {
            toast.warning("Você não pode apoiar sua própria ideia.");
          } else if (
            errorMessage.includes("Você já usou todos os seus sparks diários")
          ) {
            toast.warning("Você já utilizou todos os seus sparks diários.");
          } else {
            toast.warning(errorMessage);
          }
        } else {
          toast.error("Erro inesperado. Tente novamente.");
        }
        throw error;
      }
    },
    [contextHandleLike, remainingLikes],
  );

  return {
    likesCount,
    handleLike,
    updateLikeCount,
    remainingLikes,
    error,
  };
}
