import { useState, useCallback, useContext } from "react";
import axiosInstance from "services/axios";
import { AuthContext } from "contexts/AuthContext";
import { useDailyLikes } from "./useDailyLikes";

export function useLikes() {
  const [likesCount, setLikesCount] = useState({});
  const { user } = useContext(AuthContext);
  const { remainingLikes, fetchRemainingLikes } = useDailyLikes(user.userId);

  const handleLike = useCallback(
    async (ideaId) => {
      if (remainingLikes > 0) {
        try {
          const response = await axiosInstance.post("/storm/like-idea", {
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
          console.error("Error liking idea:", error);
          throw error;
        }
      } else {
        console.log("No remaining likes for today");
        // You might want to show a notification to the user here
      }
    },
    [user.userId, remainingLikes, fetchRemainingLikes],
  );

  const updateLikeCount = useCallback((ideaId, newCount) => {
    setLikesCount((prev) => ({
      ...prev,
      [ideaId]: newCount,
    }));
  }, []);

  return { likesCount, handleLike, updateLikeCount, remainingLikes };
}
