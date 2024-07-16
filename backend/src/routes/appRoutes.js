const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");
const authenticateToken = require("../middleware/authMiddleware");

module.exports = (appCollection) => {
  router.get("/apps", authenticateToken, async (req, res) => {
    try {
      const docs = await appCollection.find({}).toArray();
      res.json(docs);
    } catch (err) {
      console.error("Erro ao consultar o banco de dados:", err);
      res.status(500).send("Erro ao consultar o banco de dados.");
    }
  });

  // Rota para deletar um app
  router.delete("/apps/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      const result = await appCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({ message: "Nenhum dado foi deletado. ID não encontrado" });
      }
      res.send("Dado deletado com sucesso");
    } catch (err) {
      console.error("Erro ao deletar o dado do banco de dados:", err);
      res
        .status(500)
        .json({ message: "Erro ao deletar o dado do banco de dados" });
    }
  });

  // Rota para editar app existente
  router.put("/apps/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    delete newData._id;

    try {
      const result = await appCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: newData }
      );
      if (result.matchedCount === 0) {
        return res
          .status(404)
          .json({ message: "Nenhum documento foi atualizado" });
      }
      res.send("Dados atualizados com sucesso");
    } catch (err) {
      console.error("Erro ao atualizar dados no banco de dados:", err);
      res
        .status(500)
        .json({ message: "Erro ao atualizar dados no banco de dados" });
    }
  });

  // Rota para cadastrar um novo app
  router.post("/apps", authenticateToken, async (req, res) => {
    const newApp = req.body;
    try {
      const result = await appCollection.insertOne(newApp);
      if (result.insertedCount === 0) {
        return res.status(500).json({ message: "Erro ao cadastrar novo app" });
      }
      res.json({ _id: result.insertedId, ...newApp });
    } catch (err) {
      console.error("Erro ao cadastrar novo app:", err);
      res.status(500).json({ message: "Erro ao cadastrar novo app" });
    }
  });

  // Rota para listar arquivos em /assets/cards
  router.get("/apps/cards", (req, res) => {
    const cardsDir = path.join(__dirname, "../assets/cards");

    fs.readdir(cardsDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: "Unable to scan directory" });
      }

      // Filtra apenas os arquivos de imagem (ex: .jpg, .png, .jpeg)
      const imageFiles = files.filter((file) => {
        return (
          file.endsWith(".jpg") ||
          file.endsWith(".png") ||
          file.endsWith(".jpeg")
        );
      });

      res.json(imageFiles);
    });
  });

  module.exports = router;

  // Rota para listar arquivos em /assets/logos
  router.get("/apps/logos", (req, res) => {
    const logosDir = path.join(__dirname, "../assets/logos");

    fs.readdir(logosDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: "Unable to scan directory" });
      }

      // Filtra apenas os arquivos de imagem (ex: .jpg, .png, .jpeg)
      const logoFiles = files.filter((file) => {
        return (
          file.endsWith(".jpg") ||
          file.endsWith(".png") ||
          file.endsWith(".jpeg")
        );
      });

      res.json(logoFiles);
    });
  });

  module.exports = router;

  return router;
};
