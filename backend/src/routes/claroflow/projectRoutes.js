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
        const updateData = {};
        if (req.body.name) updateData["assignments.$.name"] = req.body.name;
        if (req.body.transitions)
          updateData["assignments.$.transitions"] = req.body.transitions;

        const result = await projectsCollection.updateOne(
          {
            _id: new ObjectId(projectId),
            "assignments._id": new ObjectId(assignmentId),
          },
          { $set: updateData }
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

  // Rota para atualizar múltiplas assignments com usuários
  router.patch(
    "/projects/:projectId/assign-users",
    authenticateToken,
    async (req, res) => {
      try {
        const { projectId } = req.params;
        const { assignments } = req.body;

        // Busca o projeto existente
        const project = await projectsCollection.findOne({
          _id: new ObjectId(projectId),
        });

        if (!project) {
          return res.status(404).json({ error: "Project not found" });
        }

        // Atualiza todas as assignments
        const bulkOps = assignments.map((assignment) => ({
          updateOne: {
            filter: {
              _id: new ObjectId(projectId),
              "assignments._id": new ObjectId(assignment.id),
            },
            update: {
              $set: {
                "assignments.$.assignedUsers": assignment.assignedUsers.map(
                  (id) => new ObjectId(id)
                ),
              },
            },
          },
        }));

        const result = await projectsCollection.bulkWrite(bulkOps);

        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: "No assignments updated" });
        }

        res.status(200).json({ message: "Assignments updated successfully" });
      } catch (error) {
        console.error("Erro ao atualizar assignments:", error);
        res.status(500).json({ error: "Error updating assignments" });
      }
    }
  );

  // Rota para buscar assignments de um usuário
  router.get(
    "/user/:userId/assignments",
    authenticateToken,
    async (req, res) => {
      try {
        const { userId } = req.params;
        const userObjId = new ObjectId(userId);

        const assignments = await projectsCollection
          .aggregate([
            { $unwind: "$assignments" },
            { $match: { "assignments.assignedUsers": userObjId } },
            {
              $project: {
                _id: "$assignments._id",
                name: "$assignments.name",
              },
            },
          ])
          .toArray();

        if (assignments.length === 0) {
          return res
            .status(404)
            .json({ error: "Nenhum assignment encontrado para esse usuário" });
        }

        res.status(200).json(assignments);
      } catch (error) {
        console.error("Erro ao buscar assignments para usuário:", error);
        res
          .status(500)
          .json({ error: "Erro ao buscar assignments para usuário" });
      }
    }
  );

  return router;
};
