const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

module.exports = (netfacilsgd) => {
  // Endpoint para buscar todos os documentos
  router.get("/netfacilsgd", authenticateToken, async (req, res) => {
    try {
      const docs = await netfacilsgd.find({}).toArray();
      res.json(docs);
    } catch (err) {
      console.error("Erro ao consultar o banco de dados:", err);
      res.status(500).send("Erro ao consultar o banco de dados.");
    }
  });

  // Endpoint para buscar por ID
  router.get("/netfacilsgd/:id", authenticateToken, async (req, res) => {
    const idSgd = parseInt(req.params.id, 10);
    try {
      const doc = await netfacilsgd.findOne({ ID_SGD: idSgd });
      if (!doc) {
        return res.status(404).send("Documento não encontrado.");
      }
      res.json(doc);
    } catch (err) {
      console.error("Erro ao consultar o banco de dados:", err);
      res.status(500).send("Erro ao consultar o banco de dados.");
    }
  });

  return router;
};
