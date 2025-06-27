/**
 * Middleware to clean up invalid push subscriptions
 * This should be used periodically to remove expired or invalid subscriptions
 */

const { ObjectId } = require("mongodb");

/**
 * Clean up invalid subscriptions from the database
 * @param {Object} subscriptionsCollection - MongoDB collection for subscriptions
 * @returns {Function} - Express middleware function
 */
function createSubscriptionCleanupMiddleware(subscriptionsCollection) {
  return async (req, res, next) => {
    try {
      // Only run cleanup on specific routes or conditions
      if (req.path.includes("/notifications") && req.method === "POST") {
        // Run cleanup in background, don't block the request
        setImmediate(async () => {
          try {
            await cleanupInvalidSubscriptions(subscriptionsCollection);
          } catch (error) {
            console.error("Background subscription cleanup failed:", error);
          }
        });
      }
      next();
    } catch (error) {
      console.error("Subscription cleanup middleware error:", error);
      next(); // Don't block the request even if cleanup fails
    }
  };
}

/**
 * Remove subscriptions older than specified days
 * @param {Object} subscriptionsCollection - MongoDB collection
 * @param {number} daysOld - Number of days to consider old (default: 30)
 */
async function cleanupOldSubscriptions(subscriptionsCollection, daysOld = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await subscriptionsCollection.deleteMany({
      updatedAt: { $lt: cutoffDate },
    });

    return result.deletedCount;
  } catch (error) {
    console.error("Error cleaning up old subscriptions:", error);
    throw error;
  }
}

/**
 * Remove invalid subscriptions (this would typically be called after failed push attempts)
 * @param {Object} subscriptionsCollection - MongoDB collection
 * @param {Array} invalidSubscriptionIds - Array of subscription IDs to remove
 */
async function removeInvalidSubscriptions(
  subscriptionsCollection,
  invalidSubscriptionIds
) {
  try {
    if (!invalidSubscriptionIds || invalidSubscriptionIds.length === 0) {
      return 0;
    }

    const result = await subscriptionsCollection.deleteMany({
      _id: { $in: invalidSubscriptionIds.map((id) => new ObjectId(id)) },
    });

    return result.deletedCount;
  } catch (error) {
    console.error("Error removing invalid subscriptions:", error);
    throw error;
  }
}

/**
 * General cleanup function for invalid subscriptions
 * @param {Object} subscriptionsCollection - MongoDB collection
 */
async function cleanupInvalidSubscriptions(subscriptionsCollection) {
  try {
    // Remove subscriptions without required fields
    const invalidFieldsResult = await subscriptionsCollection.deleteMany({
      $or: [
        { subscription: { $exists: false } },
        { userId: { $exists: false } },
        { "subscription.endpoint": { $exists: false } },
        { "subscription.keys": { $exists: false } },
      ],
    });

    // Remove very old subscriptions (older than 90 days)
    const oldSubscriptionsResult = await cleanupOldSubscriptions(
      subscriptionsCollection,
      90
    );

    return {
      invalidFields: invalidFieldsResult.deletedCount,
      oldSubscriptions: oldSubscriptionsResult,
    };
  } catch (error) {
    console.error("Error in general subscription cleanup:", error);
    throw error;
  }
}

/**
 * Get subscription statistics
 * @param {Object} subscriptionsCollection - MongoDB collection
 */
async function getSubscriptionStats(subscriptionsCollection) {
  try {
    const totalSubscriptions = await subscriptionsCollection.countDocuments();

    const recentSubscriptions = await subscriptionsCollection.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
    });

    const oldSubscriptions = await subscriptionsCollection.countDocuments({
      updatedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Older than 30 days
    });

    return {
      total: totalSubscriptions,
      recent: recentSubscriptions,
      old: oldSubscriptions,
    };
  } catch (error) {
    console.error("Error getting subscription stats:", error);
    throw error;
  }
}

module.exports = {
  createSubscriptionCleanupMiddleware,
  cleanupOldSubscriptions,
  removeInvalidSubscriptions,
  cleanupInvalidSubscriptions,
  getSubscriptionStats,
};
