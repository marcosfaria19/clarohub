const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const { ObjectId } = require("mongodb");

module.exports = (notificationsCollection) => {
  // POST /notifications - Criar nova notificação
  router.post("/", async (req, res) => {
    const { userId, type, message } = req.body;

    if (!userId || !type || !message) {
      return res
        .status(400)
        .json({ error: "userId, type, and message are required." });
    }

    try {
      const notification = {
        userId: new ObjectId(userId),
        type,
        message,
        createdAt: new Date(),
        read: false,
      };
      const result = await notificationsCollection.insertOne(notification);
      res.status(201).json({ _id: result.insertedId, ...notification });
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
      res.status(500).json({ error: "Error creating notification" });
    }
  });

  // GET /notifications/:userId - Obter notificações de um usuário
  router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
      const notifications = await notificationsCollection
        .find({ userId: new ObjectId(userId) })
        .toArray();
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      res.status(500).json({ error: "Error fetching notifications" });
    }
  });

  // PATCH /notifications/:notificationId/read - Marcar notificação como lida
  router.patch("/:notificationId/read", async (req, res) => {
    const { notificationId } = req.params;

    try {
      await notificationsCollection.updateOne(
        { _id: new ObjectId(notificationId) },
        { $set: { read: true } }
      );
      res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Erro ao atualizar notificação:", error);
      res.status(500).json({ error: "Error updating notification" });
    }
  });

  return router;
};
