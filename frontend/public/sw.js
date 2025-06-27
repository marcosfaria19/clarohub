// public/sw.js - Service Worker for Push Notifications
/* eslint-env browser, serviceworker, array-callback-return */

/* eslint-disable no-restricted-globals */

const CACHE_NAME = "notifications-clarohub-v1";
const urlsToCache = [
  "/",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/logo192.png",
  "/logo512.png",
  "/assets/logos/logoclaro_color.png",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            return caches.delete(name);
          }),
      );
    }),
  );
  // Ensure the service worker takes control of all pages immediately
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    }),
  );
});

// Push event - handle incoming push notifications
self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  let notificationData = {
    title: "Claro Hub",
    body: "Você tem uma nova notificação",
    icon: "/assets/icons/logoclaro_color.png",
    badge: "/assets/icons/logoclaro_color.png",
    data: {
      url: "/",
      timestamp: Date.now(),
    },
    actions: [
      {
        action: "view",
        title: "Ver",
        icon: "/action-view.png",
      },
      {
        action: "dismiss",
        title: "Dispensar",
        icon: "/action-dismiss.png",
      },
    ],
    requireInteraction: false,
    tag: "default",
    renotify: true,
    vibrate: [200, 100, 200],
  };

  // Parse notification data if available
  if (event.data) {
    try {
      const payload = event.data.json();
      notificationData = { ...notificationData, ...payload };
    } catch (error) {
      console.error("Error parsing push data:", error);
      notificationData.body = event.data.text() || notificationData.body;
    }
  }

  // Show notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      data: notificationData.data,
      actions: notificationData.actions,
      requireInteraction: notificationData.requireInteraction,
      tag: notificationData.tag,
      renotify: notificationData.renotify,
      vibrate: notificationData.vibrate,
      silent: false,
    }),
  );
});

// Notification click event - handle user interaction with notifications
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  const notification = event.notification;
  const action = event.action;
  const data = notification.data || {};

  // Close the notification
  notification.close();

  // Handle different actions
  if (action === "dismiss") {
    // Just close the notification, no further action needed
    return;
  }

  // Default action or "view" action - open the app
  const urlToOpen = data.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }

        // If no existing window/tab, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );

  // Send message to client about notification interaction
  event.waitUntil(
    clients.matchAll().then((clientList) => {
      clientList.forEach((client) => {
        client.postMessage({
          type: "NOTIFICATION_CLICKED",
          data: {
            action,
            notificationData: data,
            timestamp: Date.now(),
          },
        });
      });
    }),
  );
});

// Background sync event - handle background synchronization
self.addEventListener("sync", (event) => {
  console.log("Background sync event:", event.tag);

  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

// Function to handle background sync
async function doBackgroundSync() {
  try {
    // Perform background tasks like syncing offline data
    console.log("Performing background sync...");

    // Example: Send queued notifications or sync data
    // This would typically involve checking for pending operations
    // and executing them when network is available
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}

// Message event - handle messages from the main thread
self.addEventListener("message", (event) => {
  console.log("Service Worker received message:", event.data);

  const { type } = event.data;

  switch (type) {
    case "SKIP_WAITING":
      self.skipWaiting();
      break;
    case "GET_VERSION":
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
    case "CLEAR_CACHE":
      event.waitUntil(
        caches.delete(CACHE_NAME).then(() => {
          event.ports[0].postMessage({ success: true });
        }),
      );
      break;
    default:
      console.log("Unknown message type:", type);
  }
});

// Error event - handle service worker errors
self.addEventListener("error", (event) => {
  console.error("Service Worker error:", event.error);
});

// Unhandled rejection event - handle promise rejections
self.addEventListener("unhandledrejection", (event) => {
  console.error("Service Worker unhandled rejection:", event.reason);
  event.preventDefault();
});
