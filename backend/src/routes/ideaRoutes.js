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
      res.status(500).json({ error: "Erro ao buscar ideias" });
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
      pusher.trigger("claro-spark", "new-idea", { card: newIdea });

      return res
        .status(201)
        .json({ message: "Card criado com sucesso", idea: newIdea });
    } catch (error) {
      console.error("Erro ao criar ideia:", error);
      return res.status(500).json({ error: "Erro ao criar card" });
    }
  });

  // Rota para editar uma ideia
  router.put("/ideas/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, description, subject, anonymous } = req.body;
    const userId = req.user.id;

    try {
      const idea = await ideasCollection.findOne({ _id: new ObjectId(id) });
      if (!idea) {
        return res.status(404).json({ error: "Ideia não encontrada." });
      }

      if (idea.creator._id.toString() !== userId) {
        return res
          .status(403)
          .json({ error: "Você só pode editar suas próprias ideias." });
      }

      // Captura dados anteriores para histórico e movimentação de coluna
      const previousData = {
        subject: idea.subject,
        title: idea.title,
        description: idea.description,
        anonymous: idea.anonymous || 0,
      };

      // Atualiza a ideia no banco
      const result = await ideasCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            title,
            description,
            subject,
            anonymous: anonymous || 0,
            updatedAt: new Date(),
          },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Ideia não encontrada." });
      }

      const updatedIdea = await ideasCollection.findOne({
        _id: new ObjectId(id),
      });

      // Dispara evento de edição com payload consistente
      pusher.trigger("claro-spark", "idea-edited", {
        ideaId: updatedIdea._id.toString(),
        updatedFields: {
          title: updatedIdea.title,
          description: updatedIdea.description,
          subject: updatedIdea.subject,
          anonymous: updatedIdea.anonymous,
          status: updatedIdea.status,
        },
        previousSubject: previousData.subject,
      });

      return res.json({
        message: "Ideia atualizada com sucesso.",
        idea: updatedIdea,
      });
    } catch (error) {
      console.error("Erro ao atualizar ideia:", error);
      return res.status(500).json({ error: "Erro no servidor." });
    }
  });

  /* Rota POST para:
    - Apoiar uma ideia, adicionando o ID do usuario e aumentando a contagem de todos os sparks usados nela
    - Adicionar a contagem ao serviço de websockets do Pusher 
    - Incrementar a contagem de sparks diários usados */

  router.post("/like-idea", authenticateToken, async (req, res) => {
    const { userId, ideaId } = req.body;

    try {
      // Convertendo para ObjectId
      const userObjectId = new ObjectId(userId);
      const ideaObjectId = new ObjectId(ideaId);

      const user = await usersCollection.findOne({ _id: userObjectId });
      const idea = await ideasCollection.findOne({ _id: ideaObjectId });

      if (!user || !idea) {
        return res
          .status(404)
          .json({ message: "Usuário ou ideia não encontrada." });
      }

      if (idea.creator._id.equals(userObjectId)) {
        return res
          .status(403)
          .json({ message: "Você não pode apoiar sua própria ideia." });
      }

      if (user.dailyLikesUsed >= 3) {
        return res
          .status(403)
          .json({ message: "Você já usou todos os seus sparks diários." });
      }

      const spark = 1; // Cada clique consome 1 spark

      // Atualizar `likedBy` com sparks
      const likedByEntry = idea.likedBy.find((entry) =>
        entry.userId.equals(userObjectId)
      );

      if (likedByEntry) {
        // Incrementar sparks existentes
        likedByEntry.sparksUsed += spark;
      } else {
        // Adicionar novo registro de sparks
        idea.likedBy.push({ userId: userObjectId, sparksUsed: spark });
      }

      // Persistir alterações na ideia
      await ideasCollection.updateOne(
        { _id: ideaObjectId },
        {
          $set: { likedBy: idea.likedBy },
          $inc: { likesCount: spark },
        }
      );

      // Incrementar o contador diário de sparks do usuário
      await usersCollection.updateOne(
        { _id: userObjectId },
        { $inc: { dailyLikesUsed: spark } }
      );

      // Atualizar contagem de likes em tempo real
      pusher.trigger("claro-spark", "update-likes", {
        ideaId: ideaId,
        likesCount: idea.likesCount + spark,
      });

      return res.status(200).json({
        message: "Spark adicionado com sucesso!",
        likesCount: idea.likesCount + spark,
      });
    } catch (error) {
      console.error("Erro ao processar sparks:", error);
      res.status(500).json({ message: "Erro ao processar sparks." });
    }
  });

  // Rota para alterar o status da ideia
  router.patch("/ideas/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body;

    // Verifica se o novo status é válido
    const validStatuses = [
      "Em Análise",
      "Aprovada",
      "Arquivada",
      "Em Andamento",
    ];
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
        reason: reason || "",
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
  router.get("/ideas/download", authenticateToken, async (req, res) => {
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
        { label: "Data Alteração", value: "changedAt" },
      ];

      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(formattedData);

      res.header("Content-Type", "text/csv");
      res.attachment("ideias.csv");
      return res.send(csv);
    } catch (error) {
      console.error("Erro ao gerar CSV:", error);
      res.status(500).json({ error: "Erro ao gerar CSV" });
    }
  });

  // Rota para resetar contadores diários
  router.post("/reset-daily-counters", authenticateToken, async (req, res) => {
    try {
      await resetDailyCountersIfNeeded(usersCollection);
      res.json({ message: "Contadores diários resetados com sucesso." });
    } catch (error) {
      console.error("Erro ao resetar contadores:", error);
      res.status(500).json({ error: "Erro ao resetar contadores." });
    }
  });

  return router;
};
