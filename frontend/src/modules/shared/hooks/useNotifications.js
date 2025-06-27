import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useContext, useEffect, useCallback } from "react";
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
    refreshInterval: 300000, // Revalidate every 2 minutes for fresh notifications
  });

  // Web Push Notifications functions
  const requestNotificationPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission === "denied") {
      console.warn("Notification permission denied");
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  }, []);

  const registerServiceWorker = useCallback(async () => {
    if (!("serviceWorker" in navigator)) {
      console.warn("Service Worker not supported");
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register("/sw.js");

      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return null;
    }
  }, []);

  const subscribeToPushNotifications = useCallback(async () => {
    try {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        throw new Error("Notification permission not granted");
      }

      const registration = await registerServiceWorker();
      if (!registration) {
        throw new Error("Service Worker registration failed");
      }

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Get VAPID public key from server
        const vapidResponse = await axiosInstance.get(
          "/notifications/vapid-public-key",
        );
        const vapidPublicKey = vapidResponse.data.publicKey;

        // Create new subscription
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
      }

      // Send subscription to server
      await axiosInstance.post("/notifications/subscribe", {
        userId: user.userId,
        subscription: subscription.toJSON(),
      });

      return subscription;
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
      throw error;
    }
  }, [user?.userId, requestNotificationPermission, registerServiceWorker]);

  const unsubscribeFromPushNotifications = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        return;
      }

      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();

        // Remove subscription from server
        await axiosInstance.delete("/notifications/unsubscribe", {
          data: { userId: user.userId },
        });
      }
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications:", error);
      throw error;
    }
  }, [user?.userId]);

  const checkPushSubscriptionStatus = useCallback(async () => {
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        return { supported: false, subscribed: false };
      }

      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        return { supported: true, subscribed: false };
      }

      const subscription = await registration.pushManager.getSubscription();
      return {
        supported: true,
        subscribed: !!subscription,
        permission: Notification.permission,
      };
    } catch (error) {
      console.error("Error checking push subscription status:", error);
      return { supported: false, subscribed: false };
    }
  }, []);

  useEffect(() => {
    if (user?.userId && Notification.permission === "default") {
      // Don't auto-subscribe, wait for user action
    }
  }, [user?.userId]);

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
    // New Web Push functions
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    checkPushSubscriptionStatus,
    requestNotificationPermission,
  };
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default useNotifications;
