import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useContext, useEffect, useState, useCallback } from "react";
import axiosInstance from "services/axios";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchNotifications = useCallback(async () => {
    if (!user || !user.userId) {
      console.error("User ID is not available");
      return;
    }

    try {
      const response = await axiosInstance.get(`/notifications/${user.userId}`);
      const sortedNotifications = response.data
        .map((notification) => ({
          ...notification,
          read: notification.readBy.includes(user.userId),
        }))
        .sort((a, b) => {
          if (a.read === b.read) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return a.read ? 1 : -1;
        });
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.userId) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  const clearReadNotifications = async (notificationId) => {
    try {
      await axiosInstance.patch(`/notifications/${notificationId}/hide`, {
        userId: user.userId,
      });
      await fetchNotifications();
    } catch (error) {
      console.error("Erro ao ocultar notificação:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.patch(`/notifications/${user.userId}/mark-all-read`);
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const createGlobalNotification = async (type, message) => {
    try {
      await axiosInstance.post("/notifications", {
        type,
        message,
        isGlobal: true,
      });
      await fetchNotifications();
    } catch (error) {
      console.error("Error creating global notification:", error);
    }
  };

  const createUserNotification = async (userId, type, message) => {
    try {
      await axiosInstance.post("/notifications", {
        userId,
        type,
        message,
        isGlobal: false,
      });
      await fetchNotifications();
    } catch (error) {
      console.error("Error creating user notification:", error);
    }
  };

  return {
    notifications,
    refetchNotifications: fetchNotifications,
    clearReadNotifications,
    markAllAsRead,
    createGlobalNotification,
    createUserNotification,
  };
};

export default useNotifications;
