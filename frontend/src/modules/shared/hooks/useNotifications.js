import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useContext } from "react";
import useSWR from "swr";
import axiosInstance from "services/axios";
import { SWR_KEYS, swrConfig } from "services/swrConfig";

const useNotifications = () => {
  const { user } = useContext(AuthContext);

  // Fetcher function for SWR
  const fetcher = async (url) => {
    if (!user || !user.userId) {
      throw new Error("User ID is not available");
    }

    try {
      const response = await axiosInstance.get(url);
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
      return sortedNotifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  };

  // SWR hook with cache key based on user ID using centralized config
  const cacheKey = user?.userId ? SWR_KEYS.NOTIFICATIONS(user.userId) : null;

  const {
    data: notifications = [],
    error,
    mutate: mutateNotifications,
    isLoading,
    isValidating,
  } = useSWR(cacheKey, fetcher, {
    ...swrConfig,
    // Override specific settings for notifications
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 30000, // 30 seconds deduping
    refreshInterval: 120000, // Revalidate every 2 minutes for fresh notifications
  });

  // Manual refetch function (maintains compatibility)
  const refetchNotifications = async () => {
    if (cacheKey) {
      await mutateNotifications();
    }
  };

  const clearReadNotifications = async (notificationId) => {
    if (!user?.userId) {
      console.error("User ID is not available");
      return;
    }

    try {
      await axiosInstance.patch(`/notifications/${notificationId}/hide`, {
        userId: user.userId,
      });

      // Optimistic update: remove notification from cache
      await mutateNotifications(
        (currentNotifications) =>
          currentNotifications?.filter((n) => n._id !== notificationId) || [],
        false,
      );

      // Revalidate to ensure consistency
      await mutateNotifications();
    } catch (error) {
      console.error("Erro ao ocultar notificação:", error);
      // Revert optimistic update on error
      await mutateNotifications();
    }
  };

  // Função para marcar todas como lidas (mantém funcionalidade original do sininho)
  const markAllAsRead = async () => {
    if (!user?.userId) {
      console.error("User ID is not available");
      return;
    }

    try {
      await axiosInstance.patch(
        SWR_KEYS.NOTIFICATIONS_MARK_ALL_READ(user.userId),
      );

      // Optimistic update: mark all as read in cache
      await mutateNotifications(
        (currentNotifications) =>
          currentNotifications?.map((notification) => ({
            ...notification,
            read: true,
            readBy: notification.readBy.includes(user.userId)
              ? notification.readBy
              : [...notification.readBy, user.userId],
          })) || [],
        false,
      );

      // Revalidate to ensure consistency
      await mutateNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Revert optimistic update on error
      await mutateNotifications();
    }
  };

  // Nova função para "Excluir Tudo" (deixar todas hidden)
  const hideAllNotifications = async () => {
    if (!user?.userId) {
      console.error("User ID is not available");
      return;
    }

    try {
      await axiosInstance.patch(SWR_KEYS.NOTIFICATIONS_HIDE_ALL(user.userId));

      // Optimistic update: remove all notifications from cache
      await mutateNotifications([], false);

      // Revalidate to ensure consistency
      await mutateNotifications();
    } catch (error) {
      console.error("Error hiding all notifications:", error);
      // Revert optimistic update on error
      await mutateNotifications();
    }
  };

  const createGlobalNotification = async (type, message) => {
    if (!user?.userId) {
      console.error("User ID is not available");
      return;
    }

    try {
      await axiosInstance.post("/notifications", {
        type,
        message,
        isGlobal: true,
      });

      // Revalidate to fetch new notification
      await mutateNotifications();
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

      // Revalidate to fetch new notification
      await mutateNotifications();
    } catch (error) {
      console.error("Error creating user notification:", error);
    }
  };

  return {
    notifications,
    refetchNotifications,
    clearReadNotifications,
    markAllAsRead, // Mantém para funcionalidade do sininho
    hideAllNotifications, // Nova função para "Excluir Tudo"
    createGlobalNotification,
    createUserNotification,
    isLoading,
    isValidating,
    error,
  };
};

export default useNotifications;
