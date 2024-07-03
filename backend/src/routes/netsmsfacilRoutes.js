/* // netsmsRoutes.js

const express = require("express");
const Datastore = require("nedb");
const path = require("path");
const router = express.Router();

const netsmsfacil = new Datastore({
  filename: path.join(__dirname, "../data/netsmsfacil.db"),
  autoload: true,
});

router.get("/netsmsfacil", (req, res) => {
  netsmsfacil.find({}, (err, docs) => {
    if (err) {
      console.error("Erro ao consultar o banco de dados:", err);
      return res.status(500).send("Erro ao consultar o banco de dados.");
    }
    res.json(docs);
  });
});

router.delete("/netsmsfacil/:id", (req, res) => {
  const { id } = req.params;
  netsmsfacil.remove({ _id: id }, {}, (err, numRemoved) => {
    if (err)
      return res.status(500).send("Erro ao deletar o dado do banco de dados.");
    if (numRemoved === 0)
      return res
        .status(404)
        .send("Nenhum dado foi deletado. ID não encontrado.");
    res.send("Dado deletado com sucesso.");
  });
});

router.put("/netsmsfacil/:id", (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  netsmsfacil.update({ _id: id }, { $set: newData }, {}, (err, numReplaced) => {
    if (err)
      return res.status(500).send("Erro ao atualizar dados no banco de dados.");
    if (numReplaced === 0)
      return res.status(404).send("Nenhum documento foi atualizado.");
    res.send("Dados atualizados com sucesso.");
  });
});

router.post("/netsmsfacil", (req, res) => {
  const newItem = {
    ...req.body,
    ID: parseInt(req.body.ID),
  };
  netsmsfacil.insert(newItem, (err, item) => {
    if (err) {
      console.error("Erro ao inserir novo item:", err);
      res.status(500).json({ error: "Erro ao inserir novo item" });
      return;
    }
    res.json(item);
    console.log(item);
  });
});

module.exports = router;
 */

const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

module.exports = (netsmsfacilCollection) => {
  router.get("/netsmsfacil", async (req, res) => {
    try {
      const docs = await netsmsfacilCollection.find({}).toArray();
      res.json(docs);
    } catch (err) {
      console.error("Erro ao consultar o banco de dados:", err);
      res.status(500).send("Erro ao consultar o banco de dados.");
    }
  });

  router.delete("/netsmsfacil/:id", async (req, res) => {
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

  router.put("/netsmsfacil/:id", async (req, res) => {
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

  router.post("/netsmsfacil", async (req, res) => {
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

  return router;
};
