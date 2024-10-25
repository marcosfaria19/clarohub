// authMiddleware.js
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ mensagem: "Acesso negado" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ mensagem: "Token inválido" });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
