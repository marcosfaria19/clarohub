const express = require("express");
const { MongoClient } = require("mongodb");
const Pusher = require("pusher");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3001;
const uri =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI_PROD
    : process.env.MONGODB_URI_DEV;

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

    app.use(cors());
    app.use(express.json());

    // Rotas Hub
    const qualinetRoutes = require("./src/routes/qualinetRoutes")(
      clarohub.collection("ocqualinet")
    );
    const netsmsfacilRoutes = require("./src/routes/netsmsfacilRoutes")(
      clarohub.collection("netsmsfacil")
    );
    const netfacilsgdRoutes = require("./src/routes/netfacilsgdRoutes")(
      clarohub.collection("netfacilsgd")
    );

    const appRoutes = require("./src/routes/appRoutes")(
      clarohub.collection("apps")
    );

    // Rotas Spark
    const usersRoutes = require("./src/routes/usersRoutes")(
      clarohub.collection("users"),
      clarohub.collection("ideas")
    );
    const subjectRoutes = require("./src/routes/subjectRoutes")(
      clarohub.collection("subjects")
    );
    const ideaRoutes = require("./src/routes/ideaRoutes")(
      clarohub.collection("ideas"),
      clarohub.collection("users"),
      pusher
    );
    const rankingRoutes = require("./src/routes/rankingRoutes")(
      clarohub.collection("rankings"),
      clarohub.collection("ideas"),
      clarohub.collection("users")
    );

    const notificationRoutes = require("./src/routes/notificationRoutes")(
      clarohub.collection("notifications"),
      clarohub.collection("rankings"),
      clarohub.collection("ideas"),
      clarohub.collection("users")
    );

    // Rotas Flow
    const projectRoutes = require("./src/routes/claroflow/projectRoutes")(
      clarohub.collection("flow.projects"),
      clarohub.collection("users")
    );

    const tasksRoutes = require("./src/routes/claroflow/tasksRoutes")(
      clarohub.collection("flow.tasks"),
      clarohub.collection("users"),
      clarohub.collection("flow.projects")
    );

    // Rotas dos KPIs do dsahboard
    const insightsRoutes = require("./src/routes/insights/insightsRoutes")(
      clarohub.collection("flow.tasks"),
      clarohub.collection("users"),
      clarohub.collection("flow.projects")
    );

    // Rotas protegidas
    app.use("/", qualinetRoutes);
    app.use("/", usersRoutes);
    app.use("/", netsmsfacilRoutes);
    app.use("/", netfacilsgdRoutes);
    app.use("/", appRoutes);
    app.use("/spark/", subjectRoutes);
    app.use("/spark/", ideaRoutes);
    app.use("/spark/", rankingRoutes);
    app.use("/notifications/", notificationRoutes);
    app.use("/flow/", projectRoutes);
    app.use("/flow/tasks/", tasksRoutes);
    app.use("/insights/", insightsRoutes);

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
