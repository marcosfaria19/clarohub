//authroutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Datastore = require("nedb");
const path = require("path");

const loginDb = new Datastore({
  filename: path.join(__dirname, "../../login.db"),
  autoload: true,
});

router.post("/login", (req, res) => {
  const { LOGIN } = req.body;

  loginDb.findOne({ LOGIN }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: "Credencial inválida" });
    }

    const token = jwt.sign(
      { id: user._id, login: user.LOGIN },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
});

router.get("/permissions", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token não fornecido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }

    loginDb.findOne({ _id: decoded.id }, (err, user) => {
      if (err || !user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      res.json({ permissions: user.permissions });
    });
  });
});

module.exports = router;
