const express = require("express");
const router = express.Router();
const Datastore = require("nedb");
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcryptjs"); // Importar o bcryptjs para hash de senha
const SECRET_KEY = process.env.SECRET_KEY;

const usersDb = new Datastore({
  filename: path.join(__dirname, "../data/users.db"),
  autoload: true,
});

// Rota de login com verificação de senha
router.post("/login", async (req, res) => {
  const { LOGIN, senha } = req.body;

  try {
    const user = await new Promise((resolve, reject) => {
      usersDb.findOne({ LOGIN }, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Nome de usuário ou senha inválidos" });
    }

    // Verifica se o usuário tem senha cadastrada
    if (!user.senha) {
      return res.status(401).json({
        message:
          "Você ainda não cadastrou uma senha, registre uma senha para entrar",
      });
    }

    // Verifica a senha
    const match = await bcrypt.compare(senha, user.senha);
    if (!match) {
      return res
        .status(401)
        .json({ message: "Nome de usuário ou senha inválidos" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        LOGIN: user.LOGIN,
        PERMISSOES: user.PERMISSOES,
        NOME: user.NOME,
        GESTOR: user.GESTOR,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log("Login bem-sucedido:", { LOGIN });
    res.json({ token });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// Rota para registrar senha para um usuário existente
router.put("/register", async (req, res) => {
  const { LOGIN, senha } = req.body;

  try {
    const user = await new Promise((resolve, reject) => {
      usersDb.findOne({ LOGIN }, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });

    if (!user) {
      return res.status(401).json({
        message: "Usuário sem permissão de acesso, solicitar ao administrador",
      });
    }

    // Verifica se o usuário já possui senha cadastrada
    if (user.senha) {
      return res
        .status(400)
        .json({ message: "Este usuário já possui uma senha cadastrada" });
    }

    // Gera hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Atualiza o usuário com a senha cadastrada
    usersDb.update(
      { LOGIN },
      { $set: { senha: hashedPassword, PERMISSOES: "basic" } },
      {},
      (err, numReplaced) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erro ao cadastrar senha no banco de dados" });
        }
        if (numReplaced === 0) {
          return res
            .status(404)
            .json({ message: "Nenhum documento foi atualizado" });
        }
        res.send("Senha cadastrada com sucesso");
      }
    );
  } catch (err) {
    console.error("Erro ao registrar senha:", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
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
router.delete("/users/", (req, res) => {
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
/* 
// Rota para atualizar um usuário
router.put("/users/", (req, res) => {
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
}); */

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
