const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authenticateToken = require("../middleware/authMiddleware");
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = (usersCollection, ideasCollection) => {
  // Rota de login com verificação de senha
  router.post("/login", async (req, res) => {
    const { LOGIN, senha } = req.body;

    try {
      const user = await usersCollection.findOne({ LOGIN });

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
          avatar: user.avatar,
          dailyLikesUsed: user.dailyLikesUsed,
          dailyIdeasCreated: user.dailyIdeasCreated,
        },
        SECRET_KEY,
        { expiresIn: "12h" }
      );

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
      const user = await usersCollection.findOne({ LOGIN });

      if (!user) {
        return res.status(401).json({
          message:
            "Usuário sem permissão de acesso, solicitar ao administrador",
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
      const result = await usersCollection.updateOne(
        { LOGIN },
        { $set: { senha: hashedPassword, PERMISSOES: "guest" } }
      );

      if (result.matchedCount === 0) {
        return res
          .status(404)
          .json({ message: "Nenhum documento foi atualizado" });
      }
      res.send("Senha cadastrada com sucesso");
    } catch (err) {
      console.error("Erro ao registrar senha:", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Rota para listar todos os usuários
  router.get("/users", authenticateToken, async (req, res) => {
    try {
      const docs = await usersCollection.find({}).toArray();
      res.json(docs);
    } catch (err) {
      console.error("Erro ao consultar o banco de dados:", err);
      res.status(500).json({ message: "Erro ao consultar o banco de dados" });
    }
  });

  // Rota para listar os gestores
  router.get("/users/managers", authenticateToken, async (req, res) => {
    try {
      const docs = await usersCollection.find({}).toArray();
      const managers = [...new Set(docs.map((doc) => doc.GESTOR))];
      res.json(managers);
    } catch (err) {
      console.error("Erro ao consultar o banco de dados:", err);
      res.status(500).json({ message: "Erro ao consultar o banco de dados" });
    }
  });

  // Rota para deletar um usuário
  router.delete("/users/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
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

  // Rota para editar usuario existente
  router.put("/users/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    delete newData._id;

    try {
      const result = await usersCollection.updateOne(
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

  // Rota para cadastrar um novo usuário
  router.post("/users", authenticateToken, async (req, res) => {
    const newUser = req.body;
    try {
      const result = await usersCollection.insertOne(newUser);
      if (result.insertedCount === 0) {
        return res
          .status(500)
          .json({ message: "Erro ao cadastrar novo usuário" });
      }
      res.json({ _id: result.insertedId, ...newUser });
    } catch (err) {
      console.error("Erro ao cadastrar novo usuário:", err);
      res.status(500).json({ message: "Erro ao cadastrar novo usuário" });
    }
  });

  // Rota para resetar a senha do usuário
  router.patch(
    "/users/:id/reset-password",
    authenticateToken,
    async (req, res) => {
      const { id } = req.params;
      try {
        const result = await usersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { senha: "" } }
        );
        if (result.matchedCount === 0) {
          return res
            .status(404)
            .json({ message: "Nenhum documento foi atualizado" });
        }
        res.send("Senha resetada com sucesso");
      } catch (err) {
        console.error("Erro ao resetar a senha no banco de dados:", err);
        res
          .status(500)
          .json({ message: "Erro ao resetar a senha no banco de dados" });
      }
    }
  );
  // Rota para salvar/editar o Avatar
  router.patch("/users/:id/avatar", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { avatarSvg } = req.body;

    if (!avatarSvg) {
      return res.status(400).json({ message: "Avatar SVG é necessário" });
    }

    try {
      // Atualize o avatar do usuário
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { avatar: avatarSvg } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Atualize o avatar em todos os cards onde o usuário é o criador
      await ideasCollection.updateMany(
        { "creator._id": new ObjectId(id) },
        { $set: { "creator.avatar": avatarSvg } }
      );

      res.json({ message: "Avatar atualizado com sucesso" });
    } catch (err) {
      console.error("Erro ao salvar avatar:", err);
      res
        .status(500)
        .json({ message: "Erro ao salvar avatar no banco de dados" });
    }
  });

  // Rota para mostrar o Avatar
  router.get("/users/:id/avatar", authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(id) });

      if (!user || !user.avatar) {
        return res
          .status(404)
          .json({ message: "Usuário não encontrado ou avatar não disponível" });
      }

      res.json({ avatar: user.avatar });
    } catch (err) {
      console.error("Erro ao consultar o banco de dados:", err);
      res.status(500).json({ message: "Erro ao consultar o banco de dados" });
    }
  });

  // Rota para mostrar os likes e ideas restantes
  router.get("/users/:id/stats", authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(id) });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      res.json({
        avatar: user.avatar,
        dailyLikesUsed: user.dailyLikesUsed || 0,
        dailyIdeasCreated: user.dailyIdeasCreated || 0,
      });
    } catch (err) {
      console.error("Erro ao consultar o banco de dados:", err);
      res.status(500).json({ message: "Erro ao consultar o banco de dados" });
    }
  });

  return router;
};
