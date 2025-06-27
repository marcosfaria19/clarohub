import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useContext, useEffect, useState, useCallback } from "react";
import axiosInstance from "services/axios";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchNotifications = useCallback(async () => {
    if (!user || !user.userId) {
      console.error("User ID is not available");
      return;
    }

    setIsLoading(true);
    setError(null);

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
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.userId) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

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

  const clearReadNotifications = async (notificationId) => {
    if (!user?.userId) {
      console.error("User ID is not available");
      return;
    }

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
    if (!user?.userId) {
      console.error("User ID is not available");
      return;
    }

    try {
      await axiosInstance.patch(`/notifications/${user.userId}/mark-all-read`);
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const hideAllNotifications = async () => {
    if (!user?.userId) {
      console.error("User ID is not available");
      return;
    }

    try {
      await axiosInstance.patch(`/notifications/${user.userId}/hide-all`);
      await fetchNotifications();
    } catch (error) {
      console.error("Error hiding all notifications:", error);
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
    hideAllNotifications,
    createGlobalNotification,
    createUserNotification,
    isLoading,
    error,
    // Web Push functions
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
