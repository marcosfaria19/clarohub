/* // qualinetRoutes.js
const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const Datastore = require("nedb");
const path = require("path");
const cidadeParaUF = require("../models/cidadeParaUF");
const formatarData = require("../models/formatarData");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
const db = new Datastore({
  filename: path.join(__dirname, "../data/ocqualinet.db"),
  autoload: true,
});

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).send("Nenhum arquivo foi enviado.");

  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const colunasEsperadas = [
      "CI_NOME",
      "NUM_CONTRATO",
      "DT_CADASTRO",
      "END_COMPLETO",
      "COD_NODE",
    ];

    const extracaoValida = colunasEsperadas.every((text) => {
      let found = false;
      for (const cellAddress in sheet) {
        if (!sheet.hasOwnProperty(cellAddress)) continue;
        const cell = sheet[cellAddress];
        if (
          cell &&
          cell.v &&
          typeof cell.v === "string" &&
          cell.v.trim() === text
        ) {
          found = true;
          break;
        }
      }
      return found;
    });

    if (!extracaoValida) {
      return res.status(400).send("O arquivo XLSX não é uma extração válida.");
    }

    let data = xlsx.utils.sheet_to_json(sheet);

    data = data.map((item) => ({
      ...item,
      UF: cidadeParaUF[item.CI_NOME] || "UF não encontrada",
    }));

    const existingData = await new Promise((resolve, reject) => {
      db.find({}, (err, docs) => (err ? reject(err) : resolve(docs)));
    });

    const filteredData = data.filter(
      (newItem) =>
        !existingData.some(
          (existingItem) =>
            existingItem.NUM_CONTRATO === newItem.NUM_CONTRATO &&
            existingItem.DT_CADASTRO === newItem.DT_CADASTRO
        )
    );

    const filteredDataWithoutRS = filteredData
      .filter((item) => cidadeParaUF[item.CI_NOME] !== "RS")
      .map((item) => ({
        CI_NOME: item.CI_NOME,
        NUM_CONTRATO: item.NUM_CONTRATO,
        DT_CADASTRO: item.DT_CADASTRO,
        END_COMPLETO: item.END_COMPLETO,
        COD_NODE: item.COD_NODE,
        UF: item.UF,
      }));

    db.insert(filteredDataWithoutRS, (err, newDocs) => {
      if (err)
        return res.status(500).send("Erro ao inserir dados no banco de dados.");
      const concatenatedData = newDocs.map(
        (item) =>
          `${item.CI_NOME}*${item.UF}*${item.NUM_CONTRATO}*${formatarData(
            item.DT_CADASTRO
          )}*${item.END_COMPLETO}*${item.COD_NODE}`
      );
      res.json(concatenatedData);
    });
  } catch (error) {
    console.error("Erro ao processar dados:", error);
    res.status(500).send("Erro ao processar dados.");
  }
});

router.get("/ocqualinet", (req, res) => {
  db.find({}, (err, docs) => {
    if (err) return res.status(500).send("Erro ao consultar o banco de dados.");
    res.json(docs);
  });
});

router.delete("/ocqualinet/:id", (req, res) => {
  const { id } = req.params;
  db.remove({ _id: id }, {}, (err, numRemoved) => {
    if (err)
      return res.status(500).send("Erro ao deletar o dado do banco de dados.");
    if (numRemoved === 0)
      return res
        .status(404)
        .send("Nenhum dado foi deletado. ID não encontrado.");
    res.send("Dado deletado com sucesso.");
  });
});

router.put("/ocqualinet/:id", (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  db.update({ _id: id }, { $set: newData }, {}, (err, numReplaced) => {
    if (err)
      return res.status(500).send("Erro ao atualizar dados no banco de dados.");
    if (numReplaced === 0)
      return res.status(404).send("Nenhum documento foi atualizado.");
    res.send("Dados atualizados com sucesso.");
  });
});

module.exports = router;
 */

const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const { ObjectId } = require("mongodb");
const cidadeParaUF = require("../models/cidadeParaUF");
const formatarData = require("../models/formatarData");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

module.exports = (qualinetCollection) => {
  router.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).send("Nenhum arquivo foi enviado.");

    try {
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const colunasEsperadas = [
        "CI_NOME",
        "NUM_CONTRATO",
        "DT_CADASTRO",
        "END_COMPLETO",
        "COD_NODE",
      ];

      const extracaoValida = colunasEsperadas.every((text) => {
        let found = false;
        for (const cellAddress in sheet) {
          if (!sheet.hasOwnProperty(cellAddress)) continue;
          const cell = sheet[cellAddress];
          if (
            cell &&
            cell.v &&
            typeof cell.v === "string" &&
            cell.v.trim() === text
          ) {
            found = true;
            break;
          }
        }
        return found;
      });

      if (!extracaoValida) {
        return res
          .status(400)
          .send("O arquivo escolhido não é uma extração válida.");
      }

      let data = xlsx.utils.sheet_to_json(sheet);

      data = data.map((item) => ({
        ...item,
        UF: cidadeParaUF[item.CI_NOME] || "UF não encontrada",
      }));

      const existingData = await qualinetCollection.find({}).toArray();

      const filteredData = data.filter(
        (newItem) =>
          !existingData.some(
            (existingItem) =>
              existingItem.NUM_CONTRATO === newItem.NUM_CONTRATO &&
              existingItem.DT_CADASTRO === newItem.DT_CADASTRO
          )
      );

      const filteredDataWithoutRS = filteredData
        .filter((item) => cidadeParaUF[item.CI_NOME] !== "RS")
        .map((item) => ({
          CI_NOME: item.CI_NOME,
          NUM_CONTRATO: item.NUM_CONTRATO,
          DT_CADASTRO: item.DT_CADASTRO,
          END_COMPLETO: item.END_COMPLETO,
          COD_NODE: item.COD_NODE,
          UF: item.UF,
        }));

      if (filteredDataWithoutRS.length === 0) {
        return res.status(400).send("Nenhum dado novo a ser inserido.");
      }

      const result = await qualinetCollection.insertMany(filteredDataWithoutRS);

      console.log("result:", result);

      if (!result || !result.insertedIds) {
        return res.status(500).send("Erro ao inserir dados no banco de dados.");
      }

      const insertedIds = Object.values(result.insertedIds);

      const insertedDocuments = await qualinetCollection
        .find({
          _id: { $in: insertedIds.map((id) => new ObjectId(id)) },
        })
        .toArray();

      if (!insertedDocuments) {
        return res.status(500).send("Erro ao buscar os documentos inseridos.");
      }

      const concatenatedData = insertedDocuments.map(
        (item) =>
          `${item.CI_NOME}*${item.UF}*${item.NUM_CONTRATO}*${formatarData(
            item.DT_CADASTRO
          )}*${item.END_COMPLETO}*${item.COD_NODE}`
      );

      res.json(concatenatedData);
    } catch (error) {
      console.error("Erro ao processar dados:", error);
      res.status(500).send("Erro ao processar dados.");
    }
  });

  router.get("/ocqualinet", async (req, res) => {
    try {
      const docs = await qualinetCollection.find({}).toArray();
      res.json(docs);
    } catch (err) {
      console.error("Erro ao consultar o banco de dados:", err);
      res.status(500).send("Erro ao consultar o banco de dados.");
    }
  });

  router.delete("/ocqualinet/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const result = await qualinetCollection.deleteOne({
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

  // Rota para editar dados existente
  router.put("/ocqualinet/:id", async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    delete newData._id;

    try {
      const result = await qualinetCollection.updateOne(
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

  return router;
};
