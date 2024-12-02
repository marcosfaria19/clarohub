const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

module.exports = (rankingCollection, ideasCollection, usersCollection) => {
  // Function to calculate and update rankings
  async function updateRankings() {
    try {
      /* Ranking de criadores de ideias */
      const criadasRanking = await usersCollection
        .aggregate([
          {
            $lookup: {
              from: "ideas", // Nome da coleção de ideias
              localField: "_id", // Campo do usuário
              foreignField: "creator._id", // Campo correspondente na coleção de ideias
              as: "userIdeas", // Nome do array resultante
            },
          },
          {
            $project: {
              _id: 0,
              userId: "$_id",
              name: "$NOME",
              avatar: "$avatar",
              score: { $size: "$userIdeas" }, // Conta o número de ideias
            },
          },
          { $sort: { score: -1 } }, // Ordena por número de ideias, do maior para o menor
          /* { $limit: 30 }, // Limita qtd de usuarios procurados */
        ])
        .toArray();

      /* Ranking de ideias aprovadas */
      const aprovadasRanking = await usersCollection
        .aggregate([
          {
            $lookup: {
              from: "ideas", // Nome da coleção de ideias
              let: { userId: "$_id" }, // Variável para o ID do usuário
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$creator._id", "$$userId"] }, // Comparar IDs
                        { $eq: ["$status", "Aprovada"] }, // Filtrar ideias aprovadas
                      ],
                    },
                  },
                },
                {
                  $count: "approvedCount", // Contar as ideias aprovadas
                },
              ],
              as: "approvedIdeas", // Nome do array resultante
            },
          },
          {
            $project: {
              _id: 0,
              userId: "$_id",
              name: "$NOME",
              avatar: "$avatar",
              score: {
                $ifNull: [
                  { $arrayElemAt: ["$approvedIdeas.approvedCount", 0] },
                  0,
                ],
              }, // Pega a contagem ou retorna 0
            },
          },
          { $sort: { score: -1 } }, // Ordena por contagem de ideias aprovadas
          /* { $limit: 30 }, // Limita a 30 usuários */
        ])
        .toArray();

      /* Ranking de usuários que mais apoiaram (considerando os sparks usados) */
      const apoiadoresRanking = await usersCollection
        .aggregate([
          {
            $lookup: {
              from: "ideas", // Nome da coleção de ideias
              let: { userId: "$_id" }, // Variável para o ID do usuário
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $in: ["$$userId", "$likedBy.userId"], // Verifica se o userId está no campo likedBy
                    },
                  },
                },
                {
                  $unwind: "$likedBy", // Desfaz o array likedBy em documentos individuais
                },
                {
                  $match: {
                    $expr: {
                      $eq: ["$likedBy.userId", "$$userId"], // Filtra para considerar apenas os likes do usuário específico
                    },
                  },
                },
                {
                  $group: {
                    _id: "$_id", // Agrupar por ideia
                    totalSparksUsed: { $sum: "$likedBy.sparksUsed" }, // Soma todos os sparks usados pelo usuário nessa ideia
                  },
                },
              ],
              as: "userLikes", // Nome do array resultante
            },
          },
          {
            $project: {
              _id: 0,
              userId: "$_id",
              name: "$NOME",
              avatar: "$avatar",
              score: {
                $sum: "$userLikes.totalSparksUsed", // Soma o total de sparks usados pelo usuário em todas as ideias
              },
            },
          },
          { $sort: { score: -1 } }, // Ordena por contagem de sparks usados
          // { $limit: 30 }, // Limita a 30 usuários
        ])
        .toArray();

      // Update rankings in the rankingCollection
      await rankingCollection.updateOne(
        { type: "criadas" },
        { $set: { rankings: criadasRanking, lastUpdated: new Date() } },
        { upsert: true }
      );

      await rankingCollection.updateOne(
        { type: "aprovadas" },
        { $set: { rankings: aprovadasRanking, lastUpdated: new Date() } },
        { upsert: true }
      );

      await rankingCollection.updateOne(
        { type: "apoiadores" },
        { $set: { rankings: apoiadoresRanking, lastUpdated: new Date() } },
        { upsert: true }
      );
    } catch (error) {
      console.error("Error updating rankings:", error);
    }
  }

  // Schedule ranking updates (e.g., every hour)
  setInterval(updateRankings, 3600000);

  // Initial update
  updateRankings();

  // Route to get all rankings by type
  router.get("/rankings/:type", authenticateToken, async (req, res) => {
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
