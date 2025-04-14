const express = require("express");
const authenticateToken = require("../../middleware/authMiddleware");
const { ObjectId } = require("mongodb");
const router = express.Router();

module.exports = (projectsCollection, usersCollection) => {
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

  // Rota para buscar projeto por projectId
  router.get("/projects/:projectId", authenticateToken, async (req, res) => {
    try {
      const { projectId } = req.params;
      const project = await projectsCollection.findOne({
        _id: new ObjectId(projectId),
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.status(200).json(project);
    } catch (error) {
      console.error("Erro ao buscar projeto:", error);
      res.status(500).json({ error: "Error fetching project" });
    }
  });

  // Rota para ver demandas de um projeto específico
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
        const assignments = project.assignments.map((assignment) => ({
          id: assignment._id,
          name: assignment.name,
          assignedUsers: assignment.assignedUsers || [],
          transitions: assignment.transitions || [],
          position: assignment.position || { x: 0, y: 0 },
        }));
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

        const project = await projectsCollection.findOne({
          _id: new ObjectId(projectId),
          "assignments._id": new ObjectId(assignmentId),
        });

        if (!assignmentId) {
          return res.status(400).json({ error: "Assignment is required" });
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

        if (!assignments || !Array.isArray(assignments)) {
          return res.status(400).json({ error: "Invalid assignments format" });
        }

        // Busca o projeto existente
        const project = await projectsCollection.findOne({
          _id: new ObjectId(projectId),
        });

        if (!project) {
          return res.status(404).json({ error: "Project not found" });
        }

        // Criação das operações em lote
        const bulkOps = assignments
          .map((assignment, index) => {
            if (!assignment?.id || !assignment?.assignedUsers) {
              return null; // ou poderia lançar um erro se quiser forçar
            }

            const assignedUsersFormatted = assignment.assignedUsers.map(
              (user, i) => {
                if (!user?.userId) {
                }
                return {
                  userId: new ObjectId(user.userId),
                  regionals: user.regionals || null,
                };
              }
            );

            return {
              updateOne: {
                filter: {
                  _id: new ObjectId(projectId),
                  "assignments._id": new ObjectId(assignment.id),
                },
                update: {
                  $set: {
                    "assignments.$.assignedUsers": assignedUsersFormatted,
                  },
                },
              },
            };
          })
          .filter(Boolean); // remove possíveis nulls por assignments malformados

        if (bulkOps.length === 0) {
          return res
            .status(400)
            .json({ error: "No valid assignments to update" });
        }

        const result = await projectsCollection.bulkWrite(bulkOps);

        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: "No assignments updated" });
        }

        res.status(200).json({ message: "Assignments updated successfully" });
      } catch (error) {
        console.error("💥 Erro ao atualizar assignments:", error);
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
            { $unwind: "$assignments.assignedUsers" },
            { $match: { "assignments.assignedUsers.userId": userObjId } },
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

  // Rota para buscar detalhes dos usuários de um assignment
  router.get(
    "/assignments/:assignmentId/users/",
    authenticateToken,
    async (req, res) => {
      try {
        const { assignmentId } = req.params;
        const assignment = await projectsCollection
          .aggregate([
            { $unwind: "$assignments" },
            { $match: { "assignments._id": new ObjectId(assignmentId) } },
            { $project: { assignedUsers: "$assignments.assignedUsers" } },
          ])
          .toArray();
        console.log(assignment);

        if (assignment.length === 0) {
          return res.status(404).json({ error: "Assignment não encontrado" });
        }

        const userIds = assignment[0].assignedUsers.map((user) => user.userId);

        // Supondo que você tenha uma coleção de usuários
        const users = await usersCollection
          .find({ _id: { $in: userIds } })
          .toArray();

        res.status(200).json(users);
      } catch (error) {
        console.error(
          "Erro ao buscar detalhes dos usuários do assignment:",
          error
        );
        res.status(500).json({ error: "Erro ao buscar detalhes dos usuários" });
      }
    }
  );

  // Layout dos nodes para demandas de projetos
  router.patch(
    "/projects/:projectId/layout",
    authenticateToken,
    async (req, res) => {
      try {
        const { projectId } = req.params;
        const { nodes } = req.body;

        const bulkOps = nodes.map(({ id, position }) => ({
          updateOne: {
            filter: {
              _id: new ObjectId(projectId),
              "assignments._id": new ObjectId(id),
            },
            update: {
              $set: {
                "assignments.$.position": {
                  x: position.x,
                  y: position.y,
                },
              },
            },
          },
        }));

        const result = await projectsCollection.bulkWrite(bulkOps);

        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: "Nenhum layout atualizado" });
        }

        res.status(200).json({ message: "Layout salvo com sucesso" });
      } catch (error) {
        console.error("Erro ao salvar layout:", error);
        res.status(500).json({ error: "Erro ao salvar layout" });
      }
    }
  );
  return router;
};
