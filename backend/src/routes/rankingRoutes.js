const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

module.exports = (rankingCollection, ideasCollection, usersCollection) => {
  // Function to calculate and update rankings
  async function updateRankings() {
    try {
      // Ranking for "criadas" (users with most ideas created)
      const criadas = await ideasCollection
        .aggregate([
          {
            $group: {
              _id: "$creatorId", // Agrupa por criador
              ideaCount: { $sum: 1 }, // Conta o número de ideias criadas
            },
          },
          { $sort: { ideaCount: -1 } }, // Ordena pelos criadores com mais ideias
          { $limit: 30 }, // Limita o número de resultados
          {
            $lookup: {
              from: "users", // Busca o nome e avatar do criador na coleção de usuários
              localField: "_id", // Campo em ideasCollection (creatorId)
              foreignField: "_id", // Campo em usersCollection (userId)
              as: "creatorInfo", // Aloca o resultado do lookup aqui
            },
          },
          {
            $unwind: "$creatorInfo", // Descompacta o array do lookup
          },
          {
            $project: {
              _id: 1, // creatorId
              ideaCount: 1, // Contagem de ideias
              creatorName: "$creatorInfo.NOME", // Nome do criador vindo do lookup
              creatorAvatar: "$creatorInfo.avatar", // Avatar do criador vindo do lookup
            },
          },
        ])
        .toArray();

      // Ranking for "ideias" (users with most ideas)
      const ideias = await usersCollection
        .aggregate([
          {
            $lookup: {
              from: "ideas",
              localField: "_id",
              foreignField: "creatorId",
              as: "userIdeas",
            },
          },
          {
            $project: {
              _id: 1,
              NOME: 1,
              ideaCount: { $size: "$userIdeas" },
              avatar: { $ifNull: ["$avatar", "/placeholder-avatar.png"] },
            },
          },
          { $sort: { ideaCount: -1 } },
          { $limit: 30 },
        ])
        .toArray();

      // Ranking for "apoiadores" (users who gave most likes)
      const apoiadores = await usersCollection
        .aggregate([
          {
            $lookup: {
              from: "ideas",
              localField: "_id",
              foreignField: "likedBy",
              as: "likedIdeas",
            },
          },
          {
            $project: {
              _id: 1,
              NOME: 1,
              likeCount: { $size: "$likedIdeas" },
              avatar: { $ifNull: ["$avatar", "/placeholder-avatar.png"] },
            },
          },
          { $sort: { likeCount: -1 } },
          { $limit: 30 },
        ])
        .toArray();

      // Update rankings in the rankingCollection
      await rankingCollection.updateOne(
        { type: "criadas" },
        { $set: { rankings: criadas, lastUpdated: new Date() } },
        { upsert: true }
      );

      await rankingCollection.updateOne(
        { type: "ideias" },
        { $set: { rankings: ideias, lastUpdated: new Date() } },
        { upsert: true }
      );

      await rankingCollection.updateOne(
        { type: "apoiadores" },
        { $set: { rankings: apoiadores, lastUpdated: new Date() } },
        { upsert: true }
      );

      console.log("Rankings updated successfully");
    } catch (error) {
      console.error("Error updating rankings:", error);
    }
  }

  // Schedule ranking updates (e.g., every hour)
  setInterval(updateRankings, 3600000);

  // Initial update
  updateRankings();

  // Rota para obter todos os rankings por tipo
  router.get("/rankings/:type", async (req, res) => {
    const { type } = req.params;
    try {
      const ranking = await rankingCollection.findOne({ type });
      if (ranking) {
        res.json(ranking);
      } else {
        res.status(404).json({ error: "Ranking type not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
};
