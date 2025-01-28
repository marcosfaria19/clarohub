const express = require("express");
const authenticateToken = require("../../middleware/authMiddleware");
const { ObjectId } = require("mongodb");
const router = express.Router();

module.exports = (projectsCollection) => {
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

  // Rota para editar uma demanda (assignment)
  router.patch(
    "/projects/:projectId/assignments/:assignmentId",
    authenticateToken,
    async (req, res) => {
      try {
        const { projectId, assignmentId } = req.params;
        const { name } = req.body;

        const project = await projectsCollection.findOne({
          _id: new ObjectId(projectId),
          "assignments._id": new ObjectId(assignmentId),
        });

        if (!name) {
          return res.status(400).json({ error: "Assignment name is required" });
        }

        // Atualiza o assignment com o novo nome
        const result = await projectsCollection.updateOne(
          {
            _id: new ObjectId(projectId),
            "assignments._id": new ObjectId(assignmentId),
          },
          { $set: { "assignments.$.name": name } }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: "Assignment not found" });
        }

        res.status(200).json({ message: "Assignment updated successfully" });
      } catch (error) {
        console.error("Erro ao editar demanda:", error);
        res.status(500).json({ error: "Error editing assignment" });
      }
    }
  );

  // Rota para excluir uma demanda (assignment)
  router.delete(
    "/projects/:projectId/assignments/:assignmentId",
    authenticateToken,
    async (req, res) => {
      try {
        const { projectId, assignmentId } = req.params;

        const result = await projectsCollection.updateOne(
          { _id: new ObjectId(projectId) },
          { $pull: { assignments: { _id: new ObjectId(assignmentId) } } }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: "Assignment not found" });
        }

        res.status(200).json({ message: "Assignment deleted successfully" });
      } catch (error) {
        console.error("Erro ao excluir demanda:", error);
        res.status(500).json({ error: "Error deleting assignment" });
      }
    }
  );

  // Rota para reatribuir um usuário a múltiplas demandas
  router.patch(
    "/projects/:projectId/assign-user",
    authenticateToken,
    async (req, res) => {
      try {
        const { projectId } = req.params;
        const { userId, assignmentIds } = req.body; // assignmentIds é um array

        if (!userId || !Array.isArray(assignmentIds)) {
          return res
            .status(400)
            .json({ error: "User ID and assignment IDs are required" });
        }

        const userIdObject = new ObjectId(userId);

        // Remove o usuário de todas as demandas do projeto
        await projectsCollection.updateOne(
          { _id: new ObjectId(projectId) },
          { $pull: { "assignments.$[].assignedUsers": userIdObject } }
        );

        // Adiciona o usuário às novas demandas especificadas
        const updatePromises = assignmentIds.map((assignmentId) =>
          projectsCollection.updateOne(
            {
              _id: new ObjectId(projectId),
              "assignments._id": new ObjectId(assignmentId),
            },
            { $addToSet: { "assignments.$.assignedUsers": userIdObject } } // $addToSet evita duplicatas
          )
        );

        await Promise.all(updatePromises);

        res.status(200).json({
          message: "User successfully reassigned to project assignments",
        });
      } catch (error) {
        console.error("Error reassigning user:", error);
        res.status(500).json({
          error: "Error reassigning user to assignments",
        });
      }
    }
  );

  return router;
};
