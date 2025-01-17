// src/routes/projectRoutes.js

/* const express = require("express");
const authenticateToken = require("../../middleware/authMiddleware");
const router = express.Router();



module.exports = (workflowsCollection) => {
  router.get("/projects", authenticateToken, async (req, res) => {
    try {
      const workflows = await workflowsCollection.find({}).toArray();
      res.status(200).json(workflows);
    } catch (error) {
      console.error("Erro ao buscar cartões:", error);
      res.status(500).json({ error: "Error fetching ideas" });
    }
  });

  return router;
};
 */
