const express = require("express");
const Datastore = require("nedb");
const path = require("path");
const router = express.Router();

const appLibrary = new Datastore({
  filename: path.join(__dirname, "../data/apps.db"),
  autoload: true,
});

// Middleware para servir imagens estáticas
router.use(
  "/assets/cards",
  express.static(path.join(__dirname, "../assets/cards"))
);
router.use(
  "/assets/logos",
  express.static(path.join(__dirname, "../assets/logos"))
);

router.get("/apps", (req, res) => {
  appLibrary.find({}, (err, docs) => {
    if (err) {
      console.error("Erro ao consultar o banco de dados:", err);
      return res.status(500).send("Erro ao consultar o banco de dados.");
    }
    res.json(docs);
  });
});

/* const addApp = (nome, descricao, tipoImagem, imagemFileName) => {
  const app = {
    nome,
    descricao,
    imagemUrl: `/assets/${tipoImagem}/${imagemFileName}`, // Caminho relativo da imagem
  };

  appLibrary.insert(app, (err, newDoc) => {
    if (err) {
      console.error("Erro ao inserir o aplicativo:", err);
    } else {
      console.log("Aplicativo inserido com sucesso:", newDoc);
    }
  });
}; */

module.exports = router;
