const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ mensagem: "Acesso negado" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ mensagem: "Token mal formatado" });
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
