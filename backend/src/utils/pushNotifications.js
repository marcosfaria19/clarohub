// server/utils/pushNotifications.js

const webPush = require("web-push");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const frontendBaseUrl = "https://clarohub.netlify.app";

// VAPID keys - In production, these should be stored in environment variables
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

// Configure web-push with VAPID details
webPush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

/**
 * Send a push notification to a specific subscription
 * @param {Object} subscription - Push subscription object
 * @param {Object} payload - Notification payload
 * @returns {Promise} - Promise that resolves when notification is sent
 */
async function sendPushNotification(subscription, payload) {
  try {
    const options = {
      TTL: 24 * 60 * 60, // 24 hours
      urgency: "normal",
      headers: {
        "Content-Encoding": "gzip",
      },
    };

    const result = await webPush.sendNotification(
      subscription,
      JSON.stringify(payload),
      options
    );

    console.log("Push notification sent successfully:", result.statusCode);
    return result;
  } catch (error) {
    console.error("Error sending push notification:", error);

    // Handle specific error cases
    if (error.statusCode === 410 || error.statusCode === 404) {
      // Subscription is no longer valid, should be removed from database
      console.log("Subscription is no longer valid, should be removed");
      throw new Error("INVALID_SUBSCRIPTION");
    }

    throw error;
  }
}

/**
 * Send push notifications to multiple subscriptions
 * @param {Array} subscriptions - Array of subscription objects
 * @param {Object} payload - Notification payload
 * @returns {Promise} - Promise that resolves when all notifications are processed
 */
async function sendBulkPushNotifications(subscriptions, payload) {
  const promises = subscriptions.map((subscription) =>
    sendPushNotification(subscription, payload).catch((error) => {
      console.error("Failed to send to subscription:", error);
      return { error, subscription };
    })
  );

  const results = await Promise.allSettled(promises);

  const successful = results.filter(
    (result) => result.status === "fulfilled" && !result.value.error
  );
  const failed = results.filter(
    (result) => result.status === "rejected" || result.value?.error
  );

  console.log(
    `Bulk push notifications: ${successful.length} successful, ${failed.length} failed`
  );

  return {
    successful: successful.length,
    failed: failed.length,
    failedSubscriptions: failed
      .map((f) => f.value?.subscription)
      .filter(Boolean),
  };
}

/**
 * Create a standardized notification payload
 * @param {Object} options - Notification options
 * @returns {Object} - Formatted notification payload
 */
function createNotificationPayload({
  title,
  body,
  icon = `${frontendBaseUrl}/logo.png`,
  badge = `${frontendBaseUrl}/logo.png`,
  data = {},
  actions = [],
  requireInteraction = false,
  tag = "default",
  url = "/",
}) {
  return {
    title,
    body,
    icon,
    badge,
    data: {
      ...data,
      url,
      timestamp: Date.now(),
    },
    actions,
    requireInteraction,
    tag,
    vibrate: [200, 100, 200], // Vibration pattern for mobile devices
    renotify: true, // Allow re-notification with same tag
  };
}

/**
 * Create notification payloads for different types
 * @param {string} type - Notification type
 * @param {string} message - Notification message
 * @param {Object} additionalData - Additional data for the notification
 * @returns {Object} - Notification payload
 */
function createTypedNotificationPayload(type, message, additionalData = {}) {
  const basePayloads = {
    flow: {
      title: "Flow",
      icon: `${frontendBaseUrl}/icons/flow.png`,
      badge: `${frontendBaseUrl}/icons/flow.png`,
      tag: "flow-notification",
      requireInteraction: true,
      actions: [
        { action: "view", title: "Ver Demanda", icon: "/icons/view.png" },
        { action: "dismiss", title: "Dispensar", icon: "/icons/dismiss.png" },
      ],
      data: { url: "/flow", type: "flow" },
    },
    spark: {
      title: "Spark",
      icon: `${frontendBaseUrl}/icons/spark.png`,
      badge: `${frontendBaseUrl}/icons/spark.png`,
      tag: "spark-notification",
      requireInteraction: false,
      actions: [
        { action: "view", title: "Ver Ideia", icon: "/icons/view.png" },
        { action: "dismiss", title: "Dispensar", icon: "/icons/dismiss.png" },
      ],
      data: { url: "/spark", type: "spark" },
    },
    "spark-status": {
      title: "Status Atualizado - Spark",
      icon: `${frontendBaseUrl}/icons/spark.png`,
      badge: `${frontendBaseUrl}/icons/spark.png`,
      tag: "spark-status-notification",
      requireInteraction: true,
      actions: [
        { action: "view", title: "Ver Atualização", icon: "/icons/view.png" },
        { action: "dismiss", title: "Dispensar", icon: "/icons/dismiss.png" },
      ],
      data: { url: "/spark", type: "spark-status" },
    },
    global: {
      title: "Claro Hub",
      icon: `${frontendBaseUrl}/assets/logos/logoclaro_color.png`,
      badge: `${frontendBaseUrl}/assets/logos/logoclaro_color.png`,
      tag: "global-notification",
      requireInteraction: false,
      actions: [
        { action: "view", title: "Ver Aviso", icon: "/icons/view.png" },
        { action: "dismiss", title: "Dispensar", icon: "/icons/dismiss.png" },
      ],
      data: { url: "/", type: "global" },
    },
  };

  const basePayload = basePayloads[type] || basePayloads.global;

  return createNotificationPayload({
    ...basePayload,
    body: message,
    data: {
      ...basePayload.data,
      ...additionalData,
    },
  });
}

/**
 * Get the VAPID public key for client-side subscription
 * @returns {string} - VAPID public key
 */
function getVapidPublicKey() {
  return vapidKeys.publicKey;
}

/**
 * Generate new VAPID keys (for setup/development)
 * @returns {Object} - Object containing public and private keys
 */
function generateVapidKeys() {
  return webPush.generateVAPIDKeys();
}

module.exports = {
  sendPushNotification,
  sendBulkPushNotifications,
  createNotificationPayload,
  createTypedNotificationPayload,
  getVapidPublicKey,
  generateVapidKeys,
};
