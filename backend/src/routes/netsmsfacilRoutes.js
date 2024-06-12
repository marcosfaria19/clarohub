// netsmsRoutes.js

const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const Datastore = require("nedb");
const path = require("path");
const fs = require("fs");
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

const upload = multer({ dest: "uploads/" });

router.post("/uploadnet", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("Nenhum arquivo foi enviado.");
  }

  const filePath = path.join(__dirname, req.file.path);
  let data;
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    data = xlsx.utils.sheet_to_json(sheet);
  } catch (error) {
    console.error("Erro ao ler o arquivo Excel:", error);
    fs.unlinkSync(filePath);
    return res.status(500).send("Erro ao ler o arquivo Excel.");
  }

  // Insira os dados no NeDB
  netsmsfacil.insert(data, (err, newDocs) => {
    fs.unlinkSync(filePath); // Remova o arquivo após o processamento, independentemente do resultado
    if (err) {
      console.error("Erro ao inserir dados no banco de dados:", err);
      return res.status(500).send("Erro ao inserir dados no banco de dados.");
    }
    res.send("Dados inseridos com sucesso.");
  });
});

module.exports = router;
