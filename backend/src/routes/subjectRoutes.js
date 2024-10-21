// src/routes/subjectRoutes.js

const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();

module.exports = (subjectsCollection) => {
  router.get("/subjects", authenticateToken, async (req, res) => {
    try {
      const subjects = await subjectsCollection.find({}).toArray();
      res.status(200).json(subjects);
    } catch (error) {
      console.error("Erro ao buscar cartões:", error);
      res.status(500).json({ error: "Error fetching ideas" });
    }
  });

  return router;
};
