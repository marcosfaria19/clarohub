// src/routes/notificationRoutes.js

const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const { ObjectId } = require("mongodb");

module.exports = (notificationsCollection) => {
  // POST /notifications - Criar nova notificação
  router.post("/", async (req, res) => {
    const { userId, type, message, isGlobal } = req.body;

    if (!type || !message) {
      return res
        .status(400)
        .json({ error: "type and message are required." });
    }

    const notification = {
      userId: isGlobal ? null : new ObjectId(userId), // userId é null para notificações globais
      type,
      message,
      createdAt: new Date(),
      read: false,
      isGlobal: isGlobal || false, // Campo para indicar se é global
      readBy: [], // Array para armazenar os IDs dos usuários que marcaram como lidas
    };

    try {
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
        .find({ 
          $or: [
            { userId: new ObjectId(userId) }, // Notificações específicas do usuário
            { isGlobal: true } // Notificações globais
          ]
        })
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
    const { userId } = req.body; // ID do usuário que está marcando como lida

    try {
      // Adiciona o userId ao array readBy se ainda não estiver presente
      const updateResult = await notificationsCollection.updateOne(
        { _id: new ObjectId(notificationId) },
        { $addToSet: { readBy: new ObjectId(userId) } } // Adiciona o userId ao array readBy
      );

      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ error: "Notificação não encontrada" });
      }

      res.status(200).json({ message: "Notificação marcada como lida" });
    } catch (error) {
      console.error("Erro ao atualizar notificação:", error);
      res.status(500).json({ error: "Error updating notification" });
    }
  });

  return router;
};
