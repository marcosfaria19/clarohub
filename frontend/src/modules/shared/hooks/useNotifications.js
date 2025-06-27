import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useContext, useEffect, useState, useCallback, useRef } from "react";
import axiosInstance from "services/axios";

const useNotifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cache simples para evitar requisições desnecessárias
  const cacheRef = useRef({
    data: null,
    timestamp: null,
    userId: null,
  });

  // Cache válido por 5 minutos (300000ms)
  const CACHE_DURATION = 5 * 60 * 1000;

  // Função para processar e ordenar notificações
  const processNotifications = useCallback(
    (data) => {
      if (!user?.userId || !Array.isArray(data)) return [];

      return data
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
    },
    [user?.userId],
  );

  // Função principal para buscar notificações
  const fetchNotifications = useCallback(
    async (forceRefresh = false) => {
      if (!user?.userId) {
        console.error("User ID is not available");
        return;
      }

      // Verificar cache se não for refresh forçado
      if (
        !forceRefresh &&
        cacheRef.current.data &&
        cacheRef.current.userId === user.userId
      ) {
        const now = Date.now();
        const cacheAge = now - cacheRef.current.timestamp;

        if (cacheAge < CACHE_DURATION) {
          // Cache ainda válido, usar dados em cache
          setNotifications(cacheRef.current.data);
          return;
        }
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(
          `/notifications/${user.userId}`,
        );
        const processedNotifications = processNotifications(response.data);

        // Atualizar cache
        cacheRef.current = {
          data: processedNotifications,
          timestamp: Date.now(),
          userId: user.userId,
        };

        setNotifications(processedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError(error);

        // Em caso de erro, usar cache se disponível
        if (cacheRef.current.data && cacheRef.current.userId === user.userId) {
          setNotifications(cacheRef.current.data);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [user?.userId, processNotifications, CACHE_DURATION],
  );

  // Carregar notificações na inicialização
  useEffect(() => {
    if (user?.userId) {
      fetchNotifications();
    } else {
      // Limpar estado quando não há usuário
      setNotifications([]);
      cacheRef.current = { data: null, timestamp: null, userId: null };
    }
  }, [user?.userId, fetchNotifications]);

  // Função para atualização manual (compatibilidade)
  const refetchNotifications = useCallback(() => {
    return fetchNotifications(true);
  }, [fetchNotifications]);

  // Função para limpar notificação específica
  const clearReadNotifications = useCallback(
    async (notificationId) => {
      if (!user?.userId) {
        console.error("User ID is not available");
        return;
      }

      try {
        await axiosInstance.patch(`/notifications/${notificationId}/hide`, {
          userId: user.userId,
        });

        // Update local state imediatamente
        const updatedNotifications = notifications.filter(
          (n) => n._id !== notificationId,
        );
        setNotifications(updatedNotifications);

        // Atualizar cache
        cacheRef.current = {
          data: updatedNotifications,
          timestamp: Date.now(),
          userId: user.userId,
        };
      } catch (error) {
        console.error("Erro ao ocultar notificação:", error);
        // Em caso de erro, recarregar do servidor
        await fetchNotifications(true);
      }
    },
    [user?.userId, notifications, fetchNotifications],
  );

  // Função para marcar todas como lidas
  const markAllAsRead = useCallback(async () => {
    if (!user?.userId) {
      console.error("User ID is not available");
      return;
    }

    try {
      await axiosInstance.patch(`/notifications/${user.userId}/mark-all-read`);

      // Update local state imediatamente
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        read: true,
        readBy: notification.readBy.includes(user.userId)
          ? notification.readBy
          : [...notification.readBy, user.userId],
      }));

      setNotifications(updatedNotifications);

      // Atualizar cache
      cacheRef.current = {
        data: updatedNotifications,
        timestamp: Date.now(),
        userId: user.userId,
      };
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Em caso de erro, recarregar do servidor
      await fetchNotifications(true);
    }
  }, [user?.userId, notifications, fetchNotifications]);

  // Função para ocultar todas as notificações
  const hideAllNotifications = useCallback(async () => {
    if (!user?.userId) {
      console.error("User ID is not available");
      return;
    }

    try {
      await axiosInstance.patch(`/notifications/${user.userId}/hide-all`);

      // Update local state imediatamente
      setNotifications([]);

      // Limpar cache
      cacheRef.current = {
        data: [],
        timestamp: Date.now(),
        userId: user.userId,
      };
    } catch (error) {
      console.error("Error hiding all notifications:", error);
      // Em caso de erro, recarregar do servidor
      await fetchNotifications(true);
    }
  }, [user?.userId, fetchNotifications]);

  // Função para criar notificação global
  const createGlobalNotification = useCallback(
    async (type, message) => {
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

        // Recarregar notificações após criar nova
        await fetchNotifications(true);
      } catch (error) {
        console.error("Error creating global notification:", error);
      }
    },
    [user?.userId, fetchNotifications],
  );

  // Função para criar notificação de usuário
  const createUserNotification = useCallback(
    async (userId, type, message) => {
      try {
        await axiosInstance.post("/notifications", {
          userId,
          type,
          message,
          isGlobal: false,
        });

        // Recarregar notificações após criar nova
        await fetchNotifications(true);
      } catch (error) {
        console.error("Error creating user notification:", error);
      }
    },
    [fetchNotifications],
  );

  // === PUSH NOTIFICATIONS FUNCTIONS ===

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

  return {
    notifications,
    refetchNotifications,
    clearReadNotifications,
    markAllAsRead,
    hideAllNotifications,
    createGlobalNotification,
    createUserNotification,
    isLoading,
    error,
    // Push Notifications functions
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
