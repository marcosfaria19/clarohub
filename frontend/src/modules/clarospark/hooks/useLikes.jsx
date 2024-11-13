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
        toast.warning("Você já utilizou todos os seus sparks diários");

        throw error;
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
