// src/routes/ideaRoutes.js

const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const { ObjectId } = require("mongodb");
const { Parser } = require("json2csv");
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
    const { userId, ...rest } = req.body;

    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      const newIdea = {
        ...rest,
        createdAt: new Date(),
        history: [],
        creator: {
          _id: new ObjectId(userId),
          name: user.NOME,
          avatar: user.avatar,
        },
      };

      await ideasCollection.insertOne(newIdea);
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
  router.post("/like-idea", authenticateToken, async (req, res) => {
    const { userId, ideaId } = req.body;

    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      const idea = await ideasCollection.findOne({ _id: new ObjectId(ideaId) });

      if (!idea) {
        return res.status(404).json({ message: "Idea not found." });
      }

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Check if the user has already liked the idea
      const alreadyLiked = idea.likedBy.some((id) =>
        id.equals(new ObjectId(userId))
      );

      if (alreadyLiked) {
        // Remove the like
        await ideasCollection.updateOne(
          { _id: new ObjectId(ideaId) },
          { $pull: { likedBy: new ObjectId(userId) }, $inc: { likesCount: -1 } }
        );

        // Decrement the user's daily like count
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $inc: { dailyLikesUsed: -1 } }
        );

        // Update the idea's like count in real-time
        pusher.trigger("claro-storm", "update-likes", {
          ideaId: ideaId,
          likesCount: idea.likesCount - 1,
        });

        // Update the user's remaining likes in real-time
        pusher.trigger("claro-storm", "update-remaining-likes", {
          userId: userId,
          remainingLikes: 3 - (user.dailyLikesUsed - 1),
        });

        return res.status(200).json({
          message: "Like removed successfully!",
          likesCount: idea.likesCount - 1,
        });
      } else {
        // Add the like
        if (user.dailyLikesUsed >= 3) {
          return res
            .status(403)
            .json({ message: "You've used all your daily likes." });
        }

        await ideasCollection.updateOne(
          { _id: new ObjectId(ideaId) },
          {
            $addToSet: { likedBy: new ObjectId(userId) },
            $inc: { likesCount: 1 },
          }
        );

        // Increment the user's daily like count
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $inc: { dailyLikesUsed: 1 } }
        );

        // Update the idea's like count in real-time
        pusher.trigger("claro-storm", "update-likes", {
          ideaId: ideaId,
          likesCount: idea.likesCount + 1,
        });

        // Update the user's remaining likes in real-time
        pusher.trigger("claro-storm", "update-remaining-likes", {
          userId: userId,
          remainingLikes: 3 - (user.dailyLikesUsed + 1),
        });

        return res.status(200).json({
          message: "Like added successfully!",
          likesCount: idea.likesCount + 1,
        });
      }
    } catch (error) {
      console.error("Error liking/unliking:", error);
      res.status(500).json({ message: "Error processing like/unlike." });
    }
  });

  // Rota para alterar o status da ideia
  router.patch("/ideas/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Verifica se o novo status é válido
    const validStatuses = ["Em Análise", "Aprovada", "Arquivada"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status inválido." });
    }

    try {
      const managerName = req.user.NOME;

      // Cria um novo registro de histórico
      const historyEntry = {
        changedBy: managerName,
        newStatus: status,
        changedAt: new Date(),
      };

      // Atualiza o status da ideia e adiciona o histórico
      const updatedIdea = await ideasCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: { status },
          $push: { history: historyEntry },
        }
      );

      if (updatedIdea.matchedCount === 0) {
        return res.status(404).json({ error: "Ideia não encontrada." });
      }

      res.json({ message: "Status atualizado com sucesso." });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      res.status(500).json({ error: "Erro no servidor." });
    }
  });
  // Rota para download da tabela gerencial em CSV
  router.get("/ideas/download", async (req, res) => {
    try {
      let data = await ideasCollection.find({}).toArray();

      // Crie um novo array com as linhas formatadas
      const formattedData = data.flatMap((idea) => {
        if (idea.history && idea.history.length > 0) {
          // Mapeia o history existente
          return idea.history.map((historyItem) => ({
            title: idea.title,
            description: idea.description,
            likesCount: idea.likesCount,
            status: idea.status,
            createdAt: idea.createdAt,
            creatorName: idea.creator.name,
            manager: historyItem.changedBy,
            newStatus: historyItem.newStatus,
            changedAt: historyItem.changedAt,
          }));
        } else {
          // Entrada padrão para ideias sem histórico ("Em Análise")
          return [
            {
              title: idea.title,
              description: idea.description,
              likesCount: idea.likesCount,
              status: idea.status,
              createdAt: idea.createdAt,
              creatorName: idea.creator.name,
              manager: "",
              newStatus: "",
              changedAt: "",
            },
          ];
        }
      });

      const fields = [
        { label: "Título", value: "title" },
        { label: "Descrição", value: "description" },
        { label: "Curtidas", value: "likesCount" },
        { label: "Status", value: "status" },
        { label: "Data Criação", value: "createdAt" },
        { label: "Responsável", value: "creatorName" },
        { label: "Gestor Alteração", value: "manager" },
        { label: "Novo Status", value: "newStatus" },
        { label: "Alterado em", value: "changedAt" },
      ];

      const json2csvParser = new Parser({ fields, delimiter: ";" });
      const csv = json2csvParser.parse(formattedData);

      res.header("Content-Type", "text/csv; charset=utf-8");
      res.header(
        "Content-Disposition",
        "attachment; filename=clarostorm_ideas.csv"
      );
      res.send("\uFEFF" + csv);
    } catch (err) {
      console.error("Erro ao gerar CSV:", err);
      res.status(500).json({ message: "Erro ao gerar CSV" });
    }
  });

  return router;
};
