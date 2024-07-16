const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3001;
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  tls: true,
  tlsInsecure: true,
});

async function startServer() {
  try {
    await client.connect();

    const db = client.db("clarohub");

    app.use(cors());
    app.use(express.json());

    // Importar rotas aqui para garantir que a coleção correta foi definida
    const qualinetRoutes = require("./src/routes/qualinetRoutes")(
      db.collection("ocqualinet")
    );
    const netsmsfacilRoutes = require("./src/routes/netsmsfacilRoutes")(
      db.collection("netsmsfacil")
    );
    const usersRoutes = require("./src/routes/usersRoutes")(
      db.collection("users")
    );
    const appRoutes = require("./src/routes/appRoutes")(db.collection("apps"));

    // Rotas protegidas
    app.use("/", qualinetRoutes);
    app.use("/", usersRoutes);
    app.use("/", netsmsfacilRoutes);
    app.use("/", appRoutes);

    // Middleware para servir imagens estáticas
    app.use(
      "/assets/cards",
      express.static(path.join(__dirname, "src/assets/cards"), {
        setHeaders: (res, path) => {},
      })
    );

    app.use(
      "/assets/logos",
      express.static(path.join(__dirname, "src/assets/logos"), {
        setHeaders: (res, path) => {},
      })
    );

    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
    process.exit(1);
  }
}

startServer();
