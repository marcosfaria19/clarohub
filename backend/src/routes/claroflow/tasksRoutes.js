const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const { ObjectId } = require("mongodb");
const authenticateToken = require("../../middleware/authMiddleware");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const fs = require("fs").promises;
const path = require("path");

module.exports = (tasksCollection, usersCollection, projectsCollection) => {
  router.post(
    "/upload",
    authenticateToken,
    upload.single("file"),
    async (req, res) => {
      if (!req.file) return res.status(400).send("Nenhum arquivo foi enviado.");

      try {
        // Carregar dados de mapeamento uma única vez
        const baseGed = JSON.parse(
          await fs.readFile(
            path.join(__dirname, "../../utils/baseGedCidades.json"),
            "utf-8"
          )
        );

        // Criar mapa para lookup O(1)
        const cidadeMap = new Map(
          baseGed.map((entry) => [entry.COD_OPERADORA.toString().trim(), entry])
        );

        // Obter usuário e projeto
        const [user, project] = await Promise.all([
          usersCollection.findOne({ _id: new ObjectId(req.user.id) }),
          projectsCollection.findOne({ name: "MDU" }),
        ]);

        if (!user || !project) {
          return res.status(400).send("Usuário ou projeto não encontrado");
        }

        // Processar arquivo Excel
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const rawData = xlsx.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]]
        );

        // Validar colunas
        const requiredColumns = [
          "IDDEMANDA",
          "COD_OPERADORA",
          "ENDERECO_VISTORIA",
        ];
        if (rawData.length > 0) {
          const missing = requiredColumns.filter((col) => !(col in rawData[0]));
          if (missing.length > 0) {
            return res
              .status(400)
              .send(`Colunas faltantes: ${missing.join(", ")}`);
          }
        }

        // Processar e enriquecer dados
        const processedData = rawData
          .filter((row) => row.ENDERECO_VISTORIA?.trim())
          .map((row) => {
            const codOperadora = row.COD_OPERADORA?.toString().trim() || "";
            const cidadeInfo = cidadeMap.get(codOperadora);

            return {
              IDDEMANDA: row.IDDEMANDA,
              COD_OPERADORA: codOperadora,
              ENDERECO_VISTORIA: row.ENDERECO_VISTORIA,
              ...(cidadeInfo && {
                CIDADE: cidadeInfo.CIDADE,
                UF: cidadeInfo.UF,
                REGIONAL: cidadeInfo.REGIONAL,
                BASE: cidadeInfo.BASE,
              }),
              createdBy: {
                _id: user._id,
                name: user.NOME,
              },
              project: {
                _id: project._id,
                name: project.name,
              },
              status: {
                _id: project.assignments[0]._id,
                name: project.assignments[0].name,
              },
              insertedAt: new Date(),
              history: [
                {
                  newStatus: {
                    _id: project.assignments[0]._id,
                    name: project.assignments[0].name,
                  },
                  user: {
                    _id: user._id,
                    name: user.NOME,
                  },
                  changedAt: new Date(),
                  obs: "Importação inicial",
                },
              ],
            };
          });

        // Verificar duplicatas de forma otimizada
        const ids = processedData.map((d) => d.IDDEMANDA);
        const existing = await tasksCollection
          .find({ IDDEMANDA: { $in: ids } })
          .toArray();
        const existingIds = new Set(existing.map((d) => d.IDDEMANDA));
        const newData = processedData.filter(
          (d) => !existingIds.has(d.IDDEMANDA)
        );

        // Inserir dados não duplicados
        if (newData.length > 0) {
          await tasksCollection.insertMany(newData, { ordered: false });
        }

        res.status(200).json({
          message: "Arquivo processado com sucesso",
          total: rawData.length,
          inserted: newData.length,
          duplicates: processedData.length - newData.length,
          invalid: rawData.length - processedData.length,
        });
      } catch (err) {
        console.error("Erro no processamento:", err);
        res.status(500).send(err.message || "Erro interno no servidor");
      }
    }
  );

  // GET tasks por assignmentId

  router.get(
    "/assignment/:assignmentId",
    authenticateToken,
    async (req, res) => {
      const { assignmentId } = req.params;
      try {
        const tasks = await tasksCollection
          .find({ "status._id": new ObjectId(assignmentId) })
          .toArray();
        res.status(200).json(tasks);
      } catch (err) {
        console.error("Erro ao buscar tasks:", err);
        res.status(500).send("Erro interno");
      }
    }
  );

  // Atualizar status
  router.patch("/:id/status", authenticateToken, async (req, res) => {
    try {
      const taskId = new ObjectId(req.params.id);
      const { newStatusId, obs } = req.body;
      const user = await usersCollection.findOne({
        _id: new ObjectId(req.user.id),
      });

      // Buscar novo status
      const project = await projectsCollection.findOne({
        "assignments._id": new ObjectId(newStatusId),
      });

      if (!project) {
        return res.status(404).send("Status não encontrado");
      }

      const newStatus = project.assignments.find((a) =>
        a._id.equals(newStatusId)
      );

      // Atualizar task
      const update = {
        $set: {
          "status._id": newStatus._id,
          "status.name": newStatus.name,
        },
        $push: {
          history: {
            newStatus: {
              _id: newStatus._id,
              name: newStatus.name,
            },
            user: {
              _id: user._id,
              nome: user.nome,
            },
            changedAt: new Date(),
            obs: obs || "Status atualizado",
          },
        },
      };

      const result = await tasksCollection.updateOne({ _id: taskId }, update);

      if (result.modifiedCount === 0) {
        return res.status(404).send("Task não encontrada");
      }

      res.status(200).json({ message: "Status atualizado" });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      res.status(500).send("Erro interno");
    }
  });

  return router;
};
