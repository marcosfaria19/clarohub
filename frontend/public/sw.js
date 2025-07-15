// Service Worker para Push Notifications
/* eslint-env browser, serviceworker */
/* eslint-disable no-restricted-globals */

// Ativação do Service Worker
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");
  event.waitUntil(self.clients.claim()); // Assume o controle imediatamente
  console.log("[SW] Service Worker activated and claimed clients.");
});

// Evento 'push' - Recebimento de notificações push
self.addEventListener("push", (event) => {
  console.log("[SW] Push received.");

  let notificationData = {
    title: "Nova notificação",
    body: "Você tem uma nova mensagem.",
    icon: "/icon-192x192.png", // Ícone padrão para a notificação
    badge: "/badge-72x72.png", // Ícone que aparece na barra de status em Android
    tag: "default", // Agrupa notificações com a mesma tag
    requireInteraction: false, // Define se a notificação permanece até ser clicada
    actions: [
      {
        action: "open",
        title: "Abrir",
        icon: "/icon-open.png", // Ícone para a ação "Abrir"
      },
      {
        action: "close",
        title: "Fechar",
        icon: "/icon-close.png", // Ícone para a ação "Fechar"
      },
    ],
  };

  // Tenta parsear os dados da notificação se existirem
  if (event.data) {
    try {
      const data = event.data.json();
      // Mescla os dados recebidos com os padrões, sobrescrevendo se houver conflito
      notificationData = { ...notificationData, ...data };
      console.log("[SW] Push data parsed:", notificationData);
    } catch (error) {
      console.error("[SW] Error parsing push data:", error);
    }
  }

  // Exibe a notificação
  event.waitUntil(
    self.registration.showNotification(
      notificationData.title,
      notificationData,
    ),
  );
});

// Evento 'notificationclick' - Lida com cliques na notificação
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event.notification.tag);

  event.notification.close(); // Fecha a notificação após o clique

  // Se a ação for 'close', apenas encerra a função
  if (event.action === "close") {
    console.log("[SW] Close action clicked.");
    return;
  }

  // Abre ou foca na janela da aplicação
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Tenta focar em uma janela já aberta da sua origem
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            console.log("[SW] Focusing on existing client:", client.url);
            return client.focus();
          }
        }
        // Se nenhuma janela estiver aberta, abre uma nova
        if (clients.openWindow) {
          console.log("[SW] Opening new window.");
          return clients.openWindow("/"); // Abre a raiz da sua aplicação
        }
      }),
  );
});

// Mensagens da aplicação para o Service Worker (opcional, mantido para comunicação)
self.addEventListener("message", (event) => {
  console.log("[SW] Message received from client:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("[SW] Skip waiting command received.");
    self.skipWaiting(); // Permite que o novo SW se ative imediatamente
  }
});

// Eventos de erro (mantidos para depuração)
self.addEventListener("error", (event) => {
  console.error("[SW] Error:", event.error);
});

self.addEventListener("unhandledrejection", (event) => {
  console.error("[SW] Unhandled rejection:", event.reason);
});

console.log("[SW] Service Worker (Push-only) loaded successfully.");
