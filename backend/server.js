const express = require("express");
const cors = require("cors");
require("dotenv").config();

const qualinetRoutes = require("./src/routes/qualinetRoutes");
const netsmsfacilRoutes = require("./src/routes/netsmsfacilRoutes");
const usersRoutes = require("./src/routes/usersRoutes");
const appRoutes = require("./src/routes/appRoutes");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/", qualinetRoutes);
app.use("/", netsmsfacilRoutes);
app.use("/", usersRoutes);
app.use("/", appRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
