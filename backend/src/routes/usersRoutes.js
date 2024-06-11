// usersRoutes.js
const express = require("express");
const Datastore = require("nedb");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");

const usuarios = new Datastore({
  filename: path.join(__dirname, "../../users.db"),
  autoload: true,
});

router.get("/users", (req, res) => {
  usuarios.find({}, (err, docs) => {
    if (err) return res.status(500).send("Erro ao consultar o banco de dados.");
    res.json(docs);
  });
});

router.get("/users/managers", (req, res) => {
  usuarios.find({}, (err, docs) => {
    if (err) return res.status(500).send("Erro ao consultar o banco de dados.");
    const gestores = [...new Set(docs.map((doc) => doc.GESTOR))];
    res.json(gestores);
  });
});

router.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  usuarios.remove({ _id: id }, {}, (err, numRemoved) => {
    if (err)
      return res.status(500).send("Erro ao deletar o dado do banco de dados.");
    if (numRemoved === 0)
      return res
        .status(404)
        .send("Nenhum dado foi deletado. ID não encontrado.");
    res.send("Dado deletado com sucesso.");
  });
});

router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  usuarios.update({ _id: id }, { $set: newData }, {}, (err, numReplaced) => {
    if (err)
      return res.status(500).send("Erro ao atualizar dados no banco de dados.");
    if (numReplaced === 0)
      return res.status(404).send("Nenhum documento foi atualizado.");
    res.send("Dados atualizados com sucesso.");
  });
});

// Rotas para autenticação e login

router.post("/login", (req, res) => {
  const { LOGIN } = req.body;

  usuarios.findOne({ LOGIN }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: "Credencial inválida" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        login: user.LOGIN,
        nome: user.NOME,
        permissoes: user.PERMISSOES,
        gestor: user.GESTOR,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      nome: user.NOME,
      permissoes: user.PERMISSOES,
      gestor: user.GESTOR,
    });
  });
});

module.exports = router;
