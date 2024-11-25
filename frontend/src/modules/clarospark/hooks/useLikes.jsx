import { useState, useCallback, useContext } from "react";
import axiosInstance from "services/axios";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useDailyLikes } from "./useDailyLikes";
import { toast } from "sonner";

export function useLikes() {
  const [likesCount, setLikesCount] = useState({});
  const { user } = useContext(AuthContext);
  const { remainingLikes, fetchRemainingLikes } = useDailyLikes(user.userId);

  const handleLike = useCallback(
    async (ideaId) => {
      try {
        const response = await axiosInstance.post("/spark/like-idea", {
          ideaId,
          userId: user.userId,
        });

        if (response.status === 200) {
          setLikesCount((prev) => ({
            ...prev,
            [ideaId]: response.data.likesCount,
          }));
          fetchRemainingLikes();
          return response.data.likesCount;
        }
      } catch (error) {
        if (error.response?.status === 403) {
          const errorMessage =
            error.response?.data?.message || "Erro ao curtir.";

          // Verifica qual é a mensagem específica do erro
          if (errorMessage.includes("Você não pode curtir sua própria ideia")) {
            toast.warning("Você não pode curtir sua própria ideia.");
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
      }
    },
    [user.userId, fetchRemainingLikes],
  );

  const updateLikeCount = useCallback((ideaId, newCount) => {
    setLikesCount((prev) => ({
      ...prev,
      [ideaId]: newCount,
    }));
  }, []);

  return { likesCount, handleLike, updateLikeCount, remainingLikes };
}
