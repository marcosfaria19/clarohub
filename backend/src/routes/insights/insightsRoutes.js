const express = require("express");
const router = express.Router();

// Rota para KPIs por pessoa
router.get("/kpi/person", (req, res) => {
  // Pega possíveis filtros (ex: id da pessoa) via query params
  const filters = req.query;
  const result = calculateKPIs("person", filters);
  res.json(result);
});

// Rota para KPIs por projeto
router.get("/kpi/project", (req, res) => {
  // Pega possíveis filtros (ex: projectId) via query params
  const filters = req.query;
  const result = calculateKPIs("project", filters);
  res.json(result);
});

module.exports = router;
