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

  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.patch(`/notifications/${notificationId}/read`, {
        userId: user.userId,
      });
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const clearReadNotifications = async () => {
    try {
      await axiosInstance.delete(`/notifications/${user.userId}/read`);
      await fetchNotifications();
    } catch (error) {
      console.error("Error clearing read notifications:", error);
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

  return {
    notifications,
    refetchNotifications: fetchNotifications,
    markAsRead,
    clearReadNotifications,
    markAllAsRead,
  };
};

export default useNotifications;
