const express = require("express");
const authenticateToken = require("../../middleware/authMiddleware");
const { ObjectId } = require("mongodb");
const router = express.Router();

module.exports = (projectsCollection, assignmentsCollection) => {
  // Rota para buscar todos os projetos
  router.get("/projects", authenticateToken, async (req, res) => {
    try {
      const projects = await projectsCollection.find({}).toArray();
      res.status(200).json(projects);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      res.status(500).json({ error: "Error fetching projects" });
    }
  });

  // Rota para buscar todas as demandas
  router.get("/projects/assignments", authenticateToken, async (req, res) => {
    try {
      const assignments = await assignmentsCollection.find({}).toArray();
      res.status(200).json(assignments);
    } catch (error) {
      console.error("Erro ao buscar demandas:", error);
      res.status(500).json({ error: "Error fetching assignments" });
    }
  });

  // Rota para buscar as demandas de um projeto específico
  router.get(
    "/projects/:projectId/assignments",
    authenticateToken,
    async (req, res) => {
      const { projectId } = req.params;

      try {
        // Verifica se o ID do projeto é válido
        if (!ObjectId.isValid(projectId)) {
          return res.status(400).json({ error: "Invalid projectId" });
        }

        // Busca as demandas relacionadas ao projeto
        const assignments = await assignmentsCollection
          .find({ projectId: new ObjectId(projectId) })
          .toArray();
        res.status(200).json(assignments);
      } catch (error) {
        console.error("Erro ao buscar demandas:", error);
        res.status(500).json({ error: "Error fetching assignments" });
      }
    }
  );

  // Rota para adicionar uma nova demanda a um projeto específico
  router.post(
    "/projects/:projectId/assignments",
    authenticateToken,
    async (req, res) => {
      const { projectId } = req.params;
      const { name } = req.body;

      try {
        // Verifica se o ID do projeto é válido
        if (!ObjectId.isValid(projectId)) {
          return res.status(400).json({ error: "Invalid projectId" });
        }

        // Verifica se o nome da demanda foi fornecido
        if (!name) {
          return res.status(400).json({ error: "Assignment name is required" });
        }

        // Cria a nova demanda
        const newAssignment = {
          name,
          projectId: new ObjectId(projectId),
          assignedUsers: [], // Inicialmente sem usuários atribuídos
        };

        // Insere a nova demanda na coleção de assignments
        const result = await assignmentsCollection.insertOne(newAssignment);

        // Atualiza o projeto correspondente para incluir a referência à nova demanda
        await projectsCollection.updateOne(
          { _id: new ObjectId(projectId) },
          { $push: { assignments: { _id: result.insertedId, name } } }
        );

        res.status(201).json(newAssignment);
      } catch (error) {
        console.error("Erro ao adicionar demanda:", error);
        res.status(500).json({ error: "Error adding assignment" });
      }
    }
  );

  return router;
};
