const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

module.exports = (tasksCollection, usersCollection, projectsCollection) => {
  // Utils para período
  const getStartDate = (period) => {
    const now = new Date();
    if (period === "day") {
      return new Date(now.setHours(0, 0, 0, 0));
    } else if (period === "week") {
      const day = now.getDay();
      const start = new Date(now.setDate(now.getDate() - day));
      return new Date(start.setHours(0, 0, 0, 0));
    } else if (period === "month") {
      return new Date(now.getFullYear(), now.getMonth(), 1);
    }
    return new Date(now.setHours(0, 0, 0, 0));
  };

  /**
   * 1) Tempo Médio de Tratativa por Assignment, por usuário
   * GET /kpi/average-time
   */
  router.get("/kpi/average-time", async (req, res) => {
    const { period = "day", userId } = req.query;
    try {
      const match = {};
      if (userId) {
        match["history.user._id"] = new ObjectId(userId);
      }
      match["history.startedAt"] = { $gte: getStartDate(period) };

      const pipeline = [
        { $unwind: "$history" },
        { $match: match },
        {
          $project: {
            userId: "$history.user._id",
            userName: "$history.user.name",
            duration: {
              $subtract: ["$history.finishedAt", "$history.startedAt"],
            },
          },
        },
        {
          $group: {
            _id: {
              userId: "$userId",
              userName: "$userName",
            },
            avgDuration: { $avg: "$duration" },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            userId: { $toObjectId: { $toString: "$_id.userId" } },
            userName: "$_id.userName",
            avgDuration: 1,
            count: 1,
            _id: 0,
          },
        },
      ];

      const result = await tasksCollection.aggregate(pipeline).toArray();
      res.status(200).json(result);
    } catch (error) {
      console.error("Erro ao calcular KPI de tempo médio:", error);
      res.status(500).json({ error: "Erro ao calcular KPI de tempo médio" });
    }
  });

  /**
   * 2) Desempenho da Equipe por Assignment
   * GET /kpi/team-performance
   */
  router.get("/kpi/team-performance", async (req, res) => {
    const { projectId, assignmentId, period = "day" } = req.query;

    try {
      if (!projectId || !assignmentId) {
        return res
          .status(400)
          .json({ error: "projectId e assignmentId são obrigatórios." });
      }

      const project = await projectsCollection.findOne({
        _id: new ObjectId(projectId),
      });
      if (!project)
        return res.status(404).json({ error: "Projeto não encontrado." });

      const users = await usersCollection
        .find({ "project._id": new ObjectId(projectId) })
        .project({ _id: 1, name: 1 })
        .toArray();

      if (!users.length) {
        return res
          .status(404)
          .json({ error: "Nenhum usuário encontrado para este projeto." });
      }

      const assignedUserIds = users.map((u) => u._id);

      const match = {
        "project._id": new ObjectId(projectId),
        "history.status._id": new ObjectId(assignmentId),
        "history.startedAt": { $gte: getStartDate(period) },
        "history.user._id": { $in: assignedUserIds },
      };

      const pipeline = [
        { $unwind: "$history" },
        { $match: match },
        {
          $project: {
            userId: "$history.user._id",
            userName: "$history.user.name",
            duration: {
              $subtract: ["$history.finishedAt", "$history.startedAt"],
            },
          },
        },
        {
          $group: {
            _id: {
              userId: "$userId",
              userName: "$userName",
            },
            avgDuration: { $avg: "$duration" },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            userId: { $toObjectId: { $toString: "$_id.userId" } },
            userName: "$_id.userName",
            avgDuration: 1,
            count: 1,
            _id: 0,
          },
        },
      ];

      const result = await tasksCollection.aggregate(pipeline).toArray();
      res.status(200).json(result);
    } catch (error) {
      console.error("Erro ao calcular performance da equipe:", error);
      res.status(500).json({ error: "Erro ao calcular performance da equipe" });
    }
  });

  /**
   * 3) Contagem de Volume tratado pela Equipe
   * GET /kpi/team-volume
   */
  router.get("/kpi/team-volume", async (req, res) => {
    const { projectId, assignmentId, period = "day" } = req.query;

    try {
      if (!projectId || !assignmentId) {
        return res
          .status(400)
          .json({ error: "projectId e assignmentId são obrigatórios." });
      }

      const project = await projectsCollection.findOne({
        _id: new ObjectId(projectId),
      });
      if (!project)
        return res.status(404).json({ error: "Projeto não encontrado." });

      const assignment = project.assignments.find(
        (a) => a._id.toString() === assignmentId
      );
      if (!assignment)
        return res.status(404).json({ error: "Assignment não encontrado." });

      const match = {
        "project._id": new ObjectId(projectId),
        "history.status._id": new ObjectId(assignmentId),
        "history.startedAt": { $gte: getStartDate(period) },
      };

      const count = await tasksCollection.countDocuments(match);

      res.status(200).json({
        projectId: new ObjectId(projectId),
        projectName: project.name,
        assignmentId: new ObjectId(assignmentId),
        assignmentName: assignment.name,
        period,
        count,
      });
    } catch (error) {
      console.error("Erro ao calcular volume tratado:", error);
      res.status(500).json({ error: "Erro ao calcular volume tratado" });
    }
  });

  /**
   * 4) Radar Individual
   * GET /kpi/individual-radar
   */
  router.get("/kpi/individual-radar", async (req, res) => {
    const { userId, projectId, assignmentId, period = "day" } = req.query;

    try {
      if (!userId || !projectId || !assignmentId) {
        return res.status(400).json({
          error: "userId, projectId e assignmentId são obrigatórios.",
        });
      }

      const match = {
        "project._id": new ObjectId(projectId),
        "history.status._id": new ObjectId(assignmentId),
        "history.user._id": new ObjectId(userId),
        "history.startedAt": { $gte: getStartDate(period) },
      };

      const pipeline = [
        { $unwind: "$history" },
        { $match: match },
        {
          $project: {
            duration: {
              $subtract: ["$history.finishedAt", "$history.startedAt"],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgDuration: { $avg: "$duration" },
            count: { $sum: 1 },
            totalDuration: { $sum: "$duration" },
          },
        },
      ];

      const [result] = await tasksCollection.aggregate(pipeline).toArray();

      res.status(200).json({
        userId: new ObjectId(userId),
        projectId: new ObjectId(projectId),
        assignmentId: new ObjectId(assignmentId),
        period,
        kpis: result
          ? {
              avgDuration: result.avgDuration,
              count: result.count,
              totalDuration: result.totalDuration,
            }
          : {},
      });
    } catch (error) {
      console.error("Erro ao calcular radar individual:", error);
      res.status(500).json({ error: "Erro ao calcular radar individual" });
    }
  });

  return router;
};
