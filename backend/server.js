const express = require("express");
const { MongoClient } = require("mongodb");
const Pusher = require("pusher");
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

// Configuração do Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: false,
});

async function startServer() {
  try {
    await client.connect();

    const clarohub = client.db("clarohub");
    const clarostorm = client.db("clarostorm");

    app.use(cors());
    app.use(express.json());

    // Importar rotas aqui para garantir que a coleção correta foi definida
    const qualinetRoutes = require("./src/routes/qualinetRoutes")(
      clarohub.collection("ocqualinet")
    );
    const netsmsfacilRoutes = require("./src/routes/netsmsfacilRoutes")(
      clarohub.collection("netsmsfacil")
    );
    const netfacilsgdRoutes = require("./src/routes/netfacilsgdRoutes")(
      clarohub.collection("netfacilsgd")
    );
    const usersRoutes = require("./src/routes/usersRoutes")(
      clarohub.collection("users")
    );
    const subjectRoutes = require("./src/routes/subjectRoutes")(
      clarostorm.collection("subjects")
    );
    const ideaRoutes = require("./src/routes/ideaRoutes")(
      clarostorm.collection("ideas"),
      clarohub.collection("users"),
      pusher
    );
    const rankingRoutes = require("./src/routes/rankingRoutes")(
      clarostorm.collection("rankings"),
      clarostorm.collection("ideas"),
      clarohub.collection("users")
    );
    const appRoutes = require("./src/routes/appRoutes")(
      clarohub.collection("apps")
    );

    // Rotas protegidas
    app.use("/", qualinetRoutes);
    app.use("/", usersRoutes);
    app.use("/", netsmsfacilRoutes);
    app.use("/", netfacilsgdRoutes);
    app.use("/", appRoutes);
    app.use("/storm/", subjectRoutes);
    app.use("/storm/", ideaRoutes);
    app.use("/storm/", rankingRoutes);

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
