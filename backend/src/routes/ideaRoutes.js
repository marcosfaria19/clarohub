// src/routes/ideaRoutes.js

const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const { ObjectId } = require("mongodb");
const resetDailyCountersIfNeeded = require("../utils/resetDailyCounters");

module.exports = (ideasCollection, usersCollection, pusher) => {
  // Rota para obter todos os cartões
  router.get("/ideas", authenticateToken, async (req, res) => {
    try {
      const ideas = await ideasCollection.find({}).toArray();
      res.status(200).json(ideas);
    } catch (error) {
      console.error("Erro ao buscar cartões:", error);
      res.status(500).json({ error: "Error fetching ideas" });
    }
  });

  // Rota para criar um novo cartão
  router.post("/add-idea", authenticateToken, async (req, res) => {
    const { userId } = req.body;

    try {
      const newIdea = req.body;
      const result = await ideasCollection.insertOne(newIdea);
      pusher.trigger("claro-storm", "new-idea", {
        card: newIdea,
      });
      res
        .status(201)
        .json({ message: "Card created successfully", idea: newIdea });
    } catch (error) {
      console.error("Erro ao criar ideia:", error);
      res.status(500).json({ error: "Error creating card" });
    }
  });

  // Rota para curtir uma ideia
  router.post("/like-idea", async (req, res) => {
    const { userId, ideaId } = req.body;

    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      const idea = await ideasCollection.findOne({ _id: new ObjectId(ideaId) });

      if (!idea) {
        return res.status(404).json({ message: "Ideia não encontrada." });
      }

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // Verifica se o usuário já deu like na ideia
      const alreadyLiked = idea.likedBy.includes(userId);

      if (alreadyLiked) {
        // Remove o like
        await ideasCollection.updateOne(
          { _id: new ObjectId(ideaId) },
          { $pull: { likedBy: userId }, $inc: { likesCount: -1 } }
        );

        // Decrementa a contagem de likes do usuário
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $inc: { dailyLikesUsed: -1 } }
        );

        // Atualiza o contador de likes dos cartões em tempo real
        pusher.trigger("claro-storm", "update-likes", {
          ideaId: ideaId,
          likesCount: idea.likesCount - 1, // Atualiza o número de likes
        });

        // Atualiza o contador de likes diários do usuário em tempo real
        pusher.trigger("claro-storm", "update-remaining-likes", {
          userId: userId,
          remainingLikes: Math.max(3 - (user.dailyLikesUsed - 1), 0), // Corrige a contagem
        });

        return res.status(200).json({ message: "Like removido com sucesso!" });
      } else {
        // Adiciona o like
        if (user.dailyLikesUsed >= 3) {
          return res
            .status(403)
            .json({ message: "Você já usou todos os seus likes de hoje." });
        }

        await ideasCollection.updateOne(
          { _id: new ObjectId(ideaId) },
          { $push: { likedBy: userId }, $inc: { likesCount: 1 } }
        );

        // Incrementa a contagem de likes do usuário
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $inc: { dailyLikesUsed: 1 } }
        );

        // Atualiza o contador de likes em tempo real
        pusher.trigger("claro-storm", "update-likes", {
          ideaId: ideaId,
          likesCount: idea.likesCount + 1, // Atualiza o número de likes
        });

        // Atualiza o contador de likes diários do usuário em tempo real
        pusher.trigger("claro-storm", "update-remaining-likes", {
          userId: userId,
          remainingLikes: Math.max(3 - (user.dailyLikesUsed + 1), 0), // Corrige a contagem
        });

        return res
          .status(200)
          .json({ message: "Like registrado com sucesso!" });
      }
    } catch (error) {
      console.error("Erro ao dar like:", error);
      res.status(500).json({ message: "Erro ao dar like." });
    }
  });

  return router;
};
