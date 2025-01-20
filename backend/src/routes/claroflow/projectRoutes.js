const express = require("express");
const authenticateToken = require("../../middleware/authMiddleware");
const { ObjectId } = require("mongodb");
const router = express.Router();

module.exports = (projectsCollection) => {
  // Rota para buscar todos os projetos
  router.get("/projects", async (req, res) => {
    try {
      const projects = await projectsCollection.find({}).toArray();
      res.status(200).json(projects);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      res.status(500).json({ error: "Error fetching projects" });
    }
  });

  // Rota para buscar todas as demandas de um projeto
  router.get(
    "/projects/:projectId/assignments",
    authenticateToken,
    async (req, res) => {
      try {
        const { projectId } = req.params;
        const project = await projectsCollection.findOne({
          _id: new ObjectId(projectId),
        });

        if (!project) {
          return res.status(404).json({ error: "Project not found" });
        }

        res.status(200).json(project.assignments || []);
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
      try {
        const { projectId } = req.params;
        const { name } = req.body;

        if (!name) {
          return res.status(400).json({ error: "Assignment name is required" });
        }

        const newAssignment = {
          _id: new ObjectId(),
          name,
          assignedUsers: [],
        };

        const result = await projectsCollection.updateOne(
          { _id: new ObjectId(projectId) },
          { $push: { assignments: newAssignment } }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: "Project not found" });
        }

        res.status(201).json(newAssignment);
      } catch (error) {
        console.error("Erro ao adicionar demanda:", error);
        res.status(500).json({ error: "Error adding assignment" });
      }
    }
  );

  // Rota para buscar usuários de um projeto específico
  router.get(
    "/projects/:projectId/users",
    authenticateToken,
    async (req, res) => {
      try {
        const { projectId } = req.params;
        const project = await projectsCollection.findOne({
          _id: new ObjectId(projectId),
        });

        if (!project) {
          return res.status(404).json({ error: "Project not found" });
        }

        res.status(200).json(project.team || []);
      } catch (error) {
        console.error("Erro ao buscar usuários do projeto:", error);
        res.status(500).json({ error: "Error fetching users for the project" });
      }
    }
  );

  // Rota para buscar usuários de uma demanda de um projeto específico
  router.get(
    "/projects/:projectId/assignments/:assignmentId/users",
    authenticateToken,
    async (req, res) => {
      try {
        const { projectId, assignmentId } = req.params;
        const project = await projectsCollection.findOne({
          _id: new ObjectId(projectId),
        });

        if (!project) {
          return res.status(404).json({ error: "Project not found" });
        }

        const assignment = project.assignments.find(
          (a) => a._id.toString() === assignmentId
        );

        if (!assignment) {
          return res.status(404).json({ error: "Assignment not found" });
        }

        res.status(200).json(assignment.assignedUsers || []);
      } catch (error) {
        console.error("Erro ao buscar usuários da demanda:", error);
        res
          .status(500)
          .json({ error: "Error fetching users for the assignment" });
      }
    }
  );

  return router;
};
