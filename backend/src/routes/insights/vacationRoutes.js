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
    const { startDate, endDate, reason, employeeId, type } = req.body;

    if (!startDate || !endDate || !employeeId) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const vacation = {
      _id: new ObjectId(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason: reason || "",
      createdAt: new Date(),
      updatedAt: new Date(),
      type: type,
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
    const { startDate, endDate, reason, type } = req.body;
    try {
      const updateFields = {};
      if (startDate)
        updateFields["vacations.$.startDate"] = new Date(startDate);
      if (endDate) updateFields["vacations.$.endDate"] = new Date(endDate);
      if (reason !== undefined) updateFields["vacations.$.reason"] = reason;
      if (type) updateFields["vacations.$.type"] = type;
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

  router.delete("/:vacationId", authenticateToken, async (req, res) => {
    const { vacationId } = req.params;

    try {
      const user = await usersCollection.findOne({
        "vacations._id": new ObjectId(vacationId),
      });

      if (!user) {
        return res.status(404).json({ error: "Férias não encontradas" });
      }

      const result = await usersCollection.updateOne(
        { _id: user._id },
        { $pull: { vacations: { _id: new ObjectId(vacationId) } } }
      );

      res.status(200).json({ message: "Férias excluídas com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir férias:", error);
      res.status(500).json({ error: "Erro ao excluir férias" });
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

  return router;
};
