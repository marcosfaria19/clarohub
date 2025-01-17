// src/routes/assignmentsRoutes.js

const express = require("express");
const authenticateToken = require("../../middleware/authMiddleware");
const router = express.Router();

module.exports = (assignmentsCollection) => {
  router.get("/assignments", authenticateToken, async (req, res) => {
    try {
      const assignments = await assignmentsCollection.find({}).toArray();
      res.status(200).json(assignments);
    } catch (error) {
      console.error("Erro ao buscar demandas:", error);
      res.status(500).json({ error: "Erro ao buscar demandas" });
    }
  });

  return router;
};
