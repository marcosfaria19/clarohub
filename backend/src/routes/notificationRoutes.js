// src/routes/notificationRoutes.js

const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const { ObjectId } = require("mongodb");

module.exports = (notificationsCollection) => {
  // POST /notifications - Criar nova notificação
  router.post("/", authenticateToken, async (req, res) => {
    const { userId, type, message, isGlobal } = req.body;

    if (!type || !message) {
      return res.status(400).json({ error: "type and message are required." });
    }

    const notification = {
      userId: isGlobal ? null : new ObjectId(userId), // userId é null para notificações globais
      type,
      message,
      createdAt: new Date(),
      read: false,
      isGlobal: isGlobal || false, // Campo para indicar se é global
      readBy: [], // Array para armazenar os IDs dos usuários que marcaram como lidas
      hiddenBy: [], // Array para armazenar os IDs dos usuários que deram clear no popover
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
  router.get("/:userId", authenticateToken, async (req, res) => {
    const { userId } = req.params;

    try {
      const notifications = await notificationsCollection
        .find({
          $or: [{ userId: new ObjectId(userId) }, { isGlobal: true }],
          hiddenBy: { $ne: new ObjectId(userId) }, // Exclui notificações ocultas pelo usuário
        })
        .toArray();
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      res.status(500).json({ error: "Erro ao buscar notificações" });
    }
  });

  // PATCH /notifications/:notificationId/hide - Ocultar notificação para o usuário específico
  router.patch("/:notificationId/hide", authenticateToken, async (req, res) => {
    const { notificationId } = req.params;
    const { userId } = req.body; // ID do usuário que deseja ocultar a notificação

    try {
      // Adiciona o userId ao array hiddenBy para ocultar a notificação para o usuário
      const updateResult = await notificationsCollection.updateOne(
        { _id: new ObjectId(notificationId) },
        { $addToSet: { hiddenBy: new ObjectId(userId) } }
      );

      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ error: "Notificação não encontrada" });
      }

      res.status(200).json({ message: "Notificação oculta com sucesso" });
    } catch (error) {
      console.error("Erro ao ocultar notificação:", error);
      res.status(500).json({ error: "Erro ao ocultar notificação" });
    }
  });

  // PATCH /notifications/:userId/mark-all-read - Marcar todas as notificações como lidas
  router.patch(
    "/:userId/mark-all-read",
    authenticateToken,
    async (req, res) => {
      const { userId } = req.params;

      try {
        // Atualiza as notificações do usuário e as notificações globais, adicionando o userId ao array readBy
        const updateResult = await notificationsCollection.updateMany(
          {
            $or: [
              { userId: new ObjectId(userId) }, // Notificações específicas do usuário
              { isGlobal: true }, // Notificações globais
            ],
            readBy: { $ne: new ObjectId(userId) }, // Apenas notificações ainda não lidas pelo usuário
          },
          { $addToSet: { readBy: new ObjectId(userId) } } // Adiciona o userId ao array readBy
        );

        if (updateResult.matchedCount === 0) {
          return res
            .status(404)
            .json({ message: "Nenhuma notificação encontrada para atualizar" });
        }

        res.status(200).json({
          message: "Todas as notificações foram marcadas como lidas",
          modifiedCount: updateResult.modifiedCount,
        });
      } catch (error) {
        console.error(
          "Erro ao marcar todas as notificações como lidas:",
          error
        );
        res
          .status(500)
          .json({ error: "Erro ao marcar notificações como lidas" });
      }
    }
  );

  // PATCH /notifications/:userId/hide-all - Ocultar todas as notificações para o usuário específico
  router.patch("/:userId/hide-all", authenticateToken, async (req, res) => {
    const { userId } = req.params;

    try {
      // Atualiza todas as notificações do usuário e as notificações globais, adicionando o userId ao array hiddenBy
      const updateResult = await notificationsCollection.updateMany(
        {
          $or: [
            { userId: new ObjectId(userId) }, // Notificações específicas do usuário
            { isGlobal: true }, // Notificações globais
          ],
          hiddenBy: { $ne: new ObjectId(userId) }, // Apenas notificações ainda não ocultas pelo usuário
        },
        { $addToSet: { hiddenBy: new ObjectId(userId) } } // Adiciona o userId ao array hiddenBy
      );

      if (updateResult.matchedCount === 0) {
        return res
          .status(404)
          .json({ message: "Nenhuma notificação encontrada para ocultar" });
      }

      res.status(200).json({
        message: "Todas as notificações foram ocultadas",
        modifiedCount: updateResult.modifiedCount,
      });
    } catch (error) {
      console.error("Erro ao ocultar todas as notificações:", error);
      res.status(500).json({ error: "Erro ao ocultar notificações" });
    }
  });

  // PATCH /notifications/:userId/read-all - Alias para mark-all-read (compatibilidade)
  router.patch("/:userId/read-all", authenticateToken, async (req, res) => {
    // Redireciona para o endpoint mark-all-read
    req.url = req.url.replace("/read-all", "/mark-all-read");
    return router.handle(req, res);
  });

  return router;
};
