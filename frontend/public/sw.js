// Service Worker para Push Notifications
/* eslint-env browser, serviceworker, array-callback-return */

/* eslint-disable no-restricted-globals */

const CACHE_VERSION = "v1.0.0";
const STATIC_CACHE = `static-cache-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-cache-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-cache-${CACHE_VERSION}`;

// Detectar ambiente de desenvolvimento
const isDevelopment =
  self.location.hostname === "localhost" ||
  self.location.hostname === "127.0.0.1" ||
  self.location.port !== "" ||
  self.location.protocol === "http:";

// URLs para pré-cache (apenas recursos essenciais)
const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  // Adicione apenas recursos críticos que raramente mudam
  // Evite adicionar chunks webpack aqui
];

// URLs que devem sempre vir da network (desenvolvimento)
const NETWORK_ONLY_PATTERNS = [
  /\/sockjs-node\//, // webpack-dev-server
  /\/webpack_hmr/, // hot module replacement
  /\/__webpack_dev_server__/,
  /\/hot-update\./, // webpack hot updates
  /localhost:\d+/, // desenvolvimento local
];

// URLs que nunca devem ser cacheadas
const NEVER_CACHE_PATTERNS = [
  /\/api\/auth\//, // endpoints de autenticação
  /\/api\/.*\?/, // APIs com query params
  /chrome-extension:/,
  /moz-extension:/,
];

// Install Event - Pré-cache recursos essenciais
self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");

  // Em desenvolvimento, pular pré-cache para evitar conflitos
  if (isDevelopment) {
    console.log("[SW] Development mode - skipping precache");
    self.skipWaiting();
    return;
  }

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Precaching static resources");
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log("[SW] Skip waiting");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("[SW] Precache failed:", error);
      }),
  );
});

// Activate Event - Limpar caches antigos
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Deletar caches que não são da versão atual
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("[SW] Claiming clients");
        return self.clients.claim();
      }),
  );
});

// Fetch Event - Estratégia inteligente de cache
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Em desenvolvimento, não interceptar requests
  if (isDevelopment) {
    return; // Deixa passar direto para a network
  }

  // Verificar se deve ser ignorado
  if (shouldIgnoreRequest(request)) {
    return;
  }

  // Estratégia baseada no tipo de request
  if (request.method !== "GET") {
    return; // Apenas GET requests
  }

  // Diferentes estratégias para diferentes tipos de recursos
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
  } else if (isDynamicImport(request)) {
    event.respondWith(staleWhileRevalidateStrategy(request, DYNAMIC_CACHE));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirstStrategy(request, RUNTIME_CACHE));
  } else {
    event.respondWith(staleWhileRevalidateStrategy(request, RUNTIME_CACHE));
  }
});

// Verificar se request deve ser ignorado
function shouldIgnoreRequest(request) {
  const url = request.url;

  // Ignorar padrões específicos
  return (
    NETWORK_ONLY_PATTERNS.some((pattern) => pattern.test(url)) ||
    NEVER_CACHE_PATTERNS.some((pattern) => pattern.test(url)) ||
    url.includes("chrome-extension") ||
    url.includes("moz-extension")
  );
}

// Verificar se é asset estático
function isStaticAsset(request) {
  const url = request.url;
  return (
    /\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/.test(url) &&
    !isDynamicImport(request)
  );
}

// Verificar se é dynamic import (chunk webpack)
function isDynamicImport(request) {
  return (
    request.destination === "script" &&
    (request.url.includes("chunk") ||
      request.url.includes("lazy") ||
      /\.\w+\.js$/.test(request.url))
  ); // hash no nome
}

// Verificar se é request de API
function isAPIRequest(request) {
  return (
    request.url.includes("/api/") ||
    request.url.includes("/graphql") ||
    request.headers.get("content-type")?.includes("application/json")
  );
}

// Estratégia Cache First - Para assets estáticos
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log("[SW] Cache hit:", request.url);
      return cachedResponse;
    }

    console.log("[SW] Cache miss, fetching:", request.url);
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error("[SW] Cache first failed:", error);
    throw error;
  }
}

// Estratégia Network First - Para APIs
async function networkFirstStrategy(request, cacheName) {
  try {
    console.log("[SW] Network first:", request.url);
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("[SW] Network failed, trying cache:", request.url);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

// Estratégia Stale While Revalidate - Para dynamic imports e conteúdo dinâmico
async function staleWhileRevalidateStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    // Fetch em background para atualizar cache
    const fetchPromise = fetch(request)
      .then((networkResponse) => {
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      })
      .catch((error) => {
        console.warn("[SW] Background fetch failed:", error);
      });

    // Retornar cache imediatamente se disponível
    if (cachedResponse) {
      console.log(
        "[SW] Serving from cache, updating in background:",
        request.url,
      );
      return cachedResponse;
    }

    // Se não há cache, aguardar network
    console.log("[SW] No cache, waiting for network:", request.url);
    return await fetchPromise;
  } catch (error) {
    console.error("[SW] Stale while revalidate failed:", error);
    throw error;
  }
}

// Push Event - Notificações push
self.addEventListener("push", (event) => {
  console.log("[SW] Push received");

  let notificationData = {
    title: "Nova notificação",
    body: "Você tem uma nova mensagem",
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    tag: "default",
    requireInteraction: false,
    actions: [
      {
        action: "open",
        title: "Abrir",
        icon: "/icon-open.png",
      },
      {
        action: "close",
        title: "Fechar",
        icon: "/icon-close.png",
      },
    ],
  };

  // Parse dados do push se disponível
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
      console.error("[SW] Error parsing push data:", error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title,
      notificationData,
    ),
  );
});

// Notification Click Event
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event.notification.tag);

  event.notification.close();

  if (event.action === "close") {
    return;
  }

  // Abrir ou focar na janela da aplicação
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Se já há uma janela aberta, focar nela
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }

        // Caso contrário, abrir nova janela
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      }),
  );
});

// Background Sync Event
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync:", event.tag);

  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

// Função de background sync
async function doBackgroundSync() {
  try {
    // Implementar lógica de sincronização
    console.log("[SW] Performing background sync...");

    // Exemplo: sincronizar dados offline
    const cache = await caches.open(RUNTIME_CACHE);
    const requests = await cache.keys();

    // Processar requests pendentes
    for (const request of requests) {
      if (request.url.includes("/api/sync")) {
        try {
          await fetch(request);
          await cache.delete(request);
        } catch (error) {
          console.warn("[SW] Sync failed for:", request.url);
        }
      }
    }
  } catch (error) {
    console.error("[SW] Background sync failed:", error);
  }
}

// Message Event - Comunicação com a aplicação
self.addEventListener("message", (event) => {
  console.log("[SW] Message received:", event.data);

  if (event.data && event.data.type) {
    switch (event.data.type) {
      case "SKIP_WAITING":
        self.skipWaiting();
        break;

      case "GET_VERSION":
        event.ports[0].postMessage({ version: CACHE_VERSION });
        break;

      case "CLEAR_CACHE":
        clearAllCaches().then(() => {
          event.ports[0].postMessage({ success: true });
        });
        break;

      default:
        console.warn("[SW] Unknown message type:", event.data.type);
    }
  }
});

// Função para limpar todos os caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    console.log("[SW] All caches cleared");
  } catch (error) {
    console.error("[SW] Error clearing caches:", error);
  }
}

// Error Event
self.addEventListener("error", (event) => {
  console.error("[SW] Error:", event.error);
});

// Unhandled Rejection Event
self.addEventListener("unhandledrejection", (event) => {
  console.error("[SW] Unhandled rejection:", event.reason);
});

console.log("[SW] Service Worker loaded successfully");
