import { useState, useEffect, useCallback } from "react";
import axiosInstance from "services/axios";
import { getPusherInstance } from "services/pusher";

export function useDailyLikes(userId) {
  const [remainingLikes, setRemainingLikes] = useState(3);

  const fetchRemainingLikes = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await axiosInstance.get(`/users/${userId}/stats`);

      if (response.status === 200) {
        const { dailyLikesUsed } = response.data;
        const remainingLikes = Math.max(3 - dailyLikesUsed, 0);
        setRemainingLikes(remainingLikes);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchRemainingLikes();

    const pusher = getPusherInstance();
    const channel = pusher.subscribe("claro-storm");

    channel.bind("update-remaining-likes", function (data) {
      if (data.userId === userId) {
        setRemainingLikes(data.remainingLikes);
      }
    });

    return () => {
      channel.unbind("update-remaining-likes");
      pusher.unsubscribe("claro-storm");
    };
  }, [userId, fetchRemainingLikes]);

  return { remainingLikes, fetchRemainingLikes };
}
