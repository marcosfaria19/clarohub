const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
const qualinetRoutes = require("./src/routes/qualinetRoutes");
const netsmsfacilRoutes = require("./src/routes/netsmsfacilRoutes");
const usersRoutes = require("./src/routes/usersRoutes");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/", authRoutes);
app.use("/", qualinetRoutes);
app.use("/", netsmsfacilRoutes);
app.use("/", usersRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
