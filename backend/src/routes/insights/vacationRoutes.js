const express = require("express");
const { ObjectId } = require("mongodb");
const authenticateToken = require("../../middleware/authMiddleware");
const router = express.Router();

module.exports = (usersCollection) => {
  // Buscar todas as férias
  router.get("/", async (req, res) => {
    try {
      const users = await usersCollection
        .find({})
        .project({
          vacations: 1,
          NOME: 1,
          GESTOR: 1,
          LOGIN: 1,
          avatar: 1,
          project: 1,
        })
        .toArray();

      const vacations = users.flatMap(
        (user) =>
          user.vacations?.map((vac) => ({
            ...vac,
            userId: user._id,
            nome: user.NOME,
            avatar: user.avatar,
            gestor: user.GESTOR,
            login: user.LOGIN,
            project: user.project,
          })) || []
      );

      res.status(200).json(vacations);
    } catch (error) {
      console.error("Erro ao buscar todas as férias:", error);
      res.status(500).json({ error: "Erro ao buscar todas as férias" });
    }
  });

  // Buscar férias de um usuário específico
  router.get("/user/:userId", authenticateToken, async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (!user)
        return res.status(404).json({ error: "Usuário não encontrado" });
      res.status(200).json(user.vacations || []);
    } catch (error) {
      console.error("Erro ao buscar férias do usuário:", error);
      res.status(500).json({ error: "Erro ao buscar férias do usuário" });
    }
  });

  // Agendar novas férias
  router.post("/", authenticateToken, async (req, res) => {
    const { startDate, endDate, reason, employeeId } = req.body;

    if (!startDate || !endDate || !employeeId) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const vacation = {
      _id: new ObjectId(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason: reason || "",
      status: "approved",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(employeeId) },
        { $push: { vacations: vacation } }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.status(201).json(vacation);
    } catch (error) {
      console.error("Erro ao agendar férias:", error);
      res.status(500).json({ error: "Erro ao agendar férias" });
    }
  });

  // Atualizar férias
  router.put("/:vacationId", authenticateToken, async (req, res) => {
    const { vacationId } = req.params;
    const { startDate, endDate, reason } = req.body;
    try {
      const updateFields = {};
      if (startDate)
        updateFields["vacations.$.startDate"] = new Date(startDate);
      if (endDate) updateFields["vacations.$.endDate"] = new Date(endDate);
      if (reason !== undefined) updateFields["vacations.$.reason"] = reason;
      updateFields["vacations.$.updatedAt"] = new Date();

      const result = await usersCollection.updateOne(
        {
          _id: new ObjectId(req.user.id),
          "vacations._id": new ObjectId(vacationId),
        },
        { $set: updateFields }
      );
      if (result.matchedCount === 0)
        return res.status(404).json({ error: "Férias não encontradas" });

      const user = await usersCollection.findOne(
        { _id: new ObjectId(req.user.id) },
        {
          projection: {
            vacations: { $elemMatch: { _id: new ObjectId(vacationId) } },
          },
        }
      );
      res.status(200).json(user.vacations[0]);
    } catch (error) {
      console.error("Erro ao atualizar férias:", error);
      res.status(500).json({ error: "Erro ao atualizar férias" });
    }
  });

  // Excluir férias
  router.delete("/:vacationId", authenticateToken, async (req, res) => {
    const { vacationId } = req.params;
    try {
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(req.user.id) },
        { $pull: { vacations: { _id: new ObjectId(vacationId) } } }
      );
      if (result.modifiedCount === 0)
        return res.status(404).json({ error: "Férias não encontradas" });
      res.status(200).json({ message: "Férias excluídas com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir férias:", error);
      res.status(500).json({ error: "Erro ao excluir férias" });
    }
  });

  // Aprovar férias
  router.patch("/:vacationId/approve", authenticateToken, async (req, res) => {
    const { vacationId } = req.params;
    try {
      const result = await usersCollection.updateOne(
        { "vacations._id": new ObjectId(vacationId) },
        {
          $set: {
            "vacations.$.status": "approved",
            "vacations.$.updatedAt": new Date(),
          },
        }
      );
      if (result.matchedCount === 0)
        return res.status(404).json({ error: "Férias não encontradas" });
      res.status(200).json({ message: "Férias aprovadas" });
    } catch (error) {
      console.error("Erro ao aprovar férias:", error);
      res.status(500).json({ error: "Erro ao aprovar férias" });
    }
  });

  // Rejeitar férias
  router.patch("/:vacationId/reject", authenticateToken, async (req, res) => {
    const { vacationId } = req.params;
    const { reason } = req.body;
    try {
      const result = await usersCollection.updateOne(
        { "vacations._id": new ObjectId(vacationId) },
        {
          $set: {
            "vacations.$.status": "rejected",
            "vacations.$.rejectionReason": reason,
            "vacations.$.updatedAt": new Date(),
          },
        }
      );
      if (result.matchedCount === 0)
        return res.status(404).json({ error: "Férias não encontradas" });
      res.status(200).json({ message: "Férias rejeitadas" });
    } catch (error) {
      console.error("Erro ao rejeitar férias:", error);
      res.status(500).json({ error: "Erro ao rejeitar férias" });
    }
  });

  // Verificar sobreposição de férias
  router.post("/check-overlap", authenticateToken, async (req, res) => {
    const { userId, startDate, endDate, excludeVacationId } = req.body;
    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (!user)
        return res.status(404).json({ error: "Usuário não encontrado" });
      const overlap = user.vacations?.some((vac) => {
        if (excludeVacationId && vac._id.equals(excludeVacationId))
          return false;
        return (
          new Date(startDate) <= vac.endDate &&
          new Date(endDate) >= vac.startDate
        );
      });
      res.status(200).json({ overlap });
    } catch (error) {
      console.error("Erro ao verificar sobreposição:", error);
      res.status(500).json({ error: "Erro ao verificar sobreposição" });
    }
  });

  // Estatísticas de férias
  router.get("/stats/:userId", authenticateToken, async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (!user)
        return res.status(404).json({ error: "Usuário não encontrado" });

      const totalVacations = user.vacations?.length || 0;
      const approved =
        user.vacations?.filter((v) => v.status === "approved").length || 0;
      const pending =
        user.vacations?.filter((v) => v.status === "pending").length || 0;
      const rejected =
        user.vacations?.filter((v) => v.status === "rejected").length || 0;

      res.status(200).json({ totalVacations, approved, pending, rejected });
    } catch (error) {
      console.error("Erro ao obter estatísticas de férias:", error);
      res.status(500).json({ error: "Erro ao obter estatísticas de férias" });
    }
  });

  return router;
};
