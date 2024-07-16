const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const authenticateToken = require("../middleware/authMiddleware");
const { Parser } = require("json2csv");

module.exports = (netsmsfacilCollection) => {
  router.get("/netsmsfacil", authenticateToken, async (req, res) => {
    try {
      const docs = await netsmsfacilCollection.find({}).toArray();
      res.json(docs);
    } catch (err) {
      console.error("Erro ao consultar o banco de dados:", err);
      res.status(500).send("Erro ao consultar o banco de dados.");
    }
  });

  router.delete("/netsmsfacil/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      const result = await netsmsfacilCollection.deleteOne({
        _id: new ObjectId(id),
      });
      if (result.deletedCount === 0) {
        return res
          .status(404)
          .send("Nenhum dado foi deletado. ID não encontrado.");
      }
      res.send("Dado deletado com sucesso.");
    } catch (err) {
      console.error("Erro ao deletar o dado do banco de dados:", err);
      res.status(500).send("Erro ao deletar o dado do banco de dados.");
    }
  });

  router.put("/netsmsfacil/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    delete newData._id;
    try {
      const result = await netsmsfacilCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: newData }
      );
      if (result.matchedCount === 0) {
        return res.status(404).send("Nenhum documento foi atualizado.");
      }
      res.send("Dados atualizados com sucesso.");
    } catch (err) {
      console.error("Erro ao atualizar dados no banco de dados:", err);
      res.status(500).send("Erro ao atualizar dados no banco de dados.");
    }
  });

  router.post("/netsmsfacil", authenticateToken, async (req, res) => {
    const newItem = req.body;
    try {
      const result = await netsmsfacilCollection.insertOne(newItem);
      if (result.insertedCount === 0) {
        return res.status(500).json({ message: "Erro ao cadastrar novo id" });
      }
      res.json({ _id: result.insertedId, ...newItem });
    } catch (err) {
      console.error("Erro ao cadastrar novo id:", err);
      res.status(500).json({ message: "Erro ao cadastrar novo id" });
    }
  });

  // Rota para download da tabela de códigos em CSV
  router.get("/netsmsfacil/download", authenticateToken, async (req, res) => {
    try {
      let data = await netsmsfacilCollection.find({}).sort({ ID: 1 }).toArray();

      // Substituir "Não" por "Nao" nas colunas "OBS e INCIDENTE"
      data = data.map((item) => {
        if (item.OBS === "Não") {
          item.OBS = "Nao";
        }
        if (item.INCIDENTE === "Não") {
          item.INCIDENTE = "Nao";
        }
        return item;
      });

      const fields = [
        { label: "ID", value: "ID" },
        { label: "TRATATIVA", value: "TRATATIVA" },
        { label: "TIPO", value: "TIPO" },
        { label: "ABERTURA/FECHAMENTO", value: "ABERTURA/FECHAMENTO" },
        { label: "NETSMS", value: "NETSMS" },
        { label: "TEXTO PADRAO", value: "TEXTO PADRAO" },
        { label: "OBS OBRIGATORIO", value: "OBS" },
        { label: "INCIDENTE OBRIGATORIO", value: "INCIDENTE" },
      ];

      const json2csvParser = new Parser({ fields, delimiter: ";" });
      const csv = json2csvParser.parse(data);

      res.header("Content-Type", "text/csv");
      res.attachment("netsmsfacil.csv");
      res.send(csv);
    } catch (err) {
      console.error("Erro ao gerar CSV:", err);
      res.status(500).json({ message: "Erro ao gerar CSV" });
    }
  });

  return router;
};
