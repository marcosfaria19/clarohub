const express = require("express");
const router = express.Router();
const Datastore = require("nedb");
const jwt = require("jsonwebtoken");
const path = require("path");
const SECRET_KEY = process.env.SECRET_KEY;

const usersDb = new Datastore({
  filename: path.join(__dirname, "../data/users.db"),
  autoload: true,
});

// Rota de login
router.post("/login", (req, res) => {
  const { LOGIN } = req.body;

  usersDb.findOne({ LOGIN }, (err, user) => {
    if (err) {
      console.error("Erro no banco de dados:", err);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
    if (!user) {
      console.log("Usuário não encontrado");
      return res
        .status(401)
        .json({ message: "Nome de usuário ou senha inválidos" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        LOGIN: user.LOGIN,
        role: user.PERMISSOES,
        NOME: user.NOME,
        GESTOR: user.GESTOR,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    console.log("Login bem-sucedido:", { LOGIN });
    res.json({ token });
  });
});

// Rota para listar todos os usuários
router.get("/users", (req, res) => {
  usersDb.find({}, (err, docs) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao consultar o banco de dados" });
    }
    res.json(docs);
  });
});

// Rota para listar os gestores
router.get("/users/managers", (req, res) => {
  usersDb.find({}, (err, docs) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao consultar o banco de dados" });
    }
    const managers = [...new Set(docs.map((doc) => doc.GESTOR))];
    res.json(managers);
  });
});

// Rota para deletar um usuário
router.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  usersDb.remove({ _id: id }, {}, (err, numRemoved) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao deletar o dado do banco de dados" });
    }
    if (numRemoved === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum dado foi deletado. ID não encontrado" });
    }
    res.send("Dado deletado com sucesso");
  });
});

// Rota para atualizar um usuário
router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  usersDb.update({ _id: id }, { $set: newData }, {}, (err, numReplaced) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao atualizar dados no banco de dados" });
    }
    if (numReplaced === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum documento foi atualizado" });
    }
    res.send("Dados atualizados com sucesso");
  });
});

// Rota para cadastrar um novo usuário
router.post("/users", (req, res) => {
  const newUser = req.body;

  usersDb.insert(newUser, (err, user) => {
    if (err) {
      console.error("Erro ao cadastrar novo usuário:", err);
      return res
        .status(500)
        .json({ message: "Erro ao cadastrar novo usuário" });
    }
    res.json(user);
  });
});

module.exports = router;
