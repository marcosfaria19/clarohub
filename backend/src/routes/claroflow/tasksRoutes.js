const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const { ObjectId } = require("mongodb");
const authenticateToken = require("../../middleware/authMiddleware");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

module.exports = (tasksCollection, usersCollection, projectsCollection) => {
  router.post(
    "/upload",
    authenticateToken,
    upload.single("file"),
    async (req, res) => {
      if (!req.file) return res.status(400).send("Nenhum arquivo foi enviado.");

      try {
        // Obter usuário e projeto
        const user = await usersCollection.findOne({
          _id: new ObjectId(req.user.id),
        });
        const project = await projectsCollection.findOne({ name: "MDU" }); // ALTERAR A LÓGICA PARA ENCONTRAR O TIPO DE PROJETO CORRETO

        if (!user || !project) {
          return res.status(400).send("Usuário ou projeto não encontrado");
        }

        // Processar arquivo
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawData = xlsx.utils.sheet_to_json(sheet);

        // Validar colunas
        const requiredColumns = [
          "IDDEMANDA",
          "COD_OPERADORA",
          "ENDERECO_VISTORIA",
        ];
        const missing = requiredColumns.filter(
          (col) => !rawData[0] || !(col in rawData[0])
        );

        if (missing.length > 0) {
          return res
            .status(400)
            .send(`Colunas faltantes: ${missing.join(", ")}`);
        }

        // Processar dados
        const processedData = rawData
          .filter((row) => row.ENDERECO_VISTORIA?.trim())
          .map((row) => ({
            IDDEMANDA: row.IDDEMANDA,
            COD_OPERADORA: row.COD_OPERADORA,
            ENDERECO_VISTORIA: row.ENDERECO_VISTORIA,
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
          }));

        // Inserir no banco
        const ids = processedData.map((d) => d.IDDEMANDA);
        const existing = await tasksCollection
          .find({ IDDEMANDA: { $in: ids } })
          .toArray();
        const existingIds = existing.map((d) => d.IDDEMANDA);
        const newData = processedData.filter(
          (d) => !existingIds.includes(d.IDDEMANDA)
        );

        if (newData.length > 0) {
          await tasksCollection.insertMany(newData);
        }

        res.status(200).json({
          message: "Arquivo processado",
          total: rawData.length,
          inserted: newData.length,
          duplicates: processedData.length - newData.length,
        });
      } catch (err) {
        console.error("Erro no upload:", err);
        res.status(500).send("Erro interno no servidor");
      }
    }
  );

  // GET todas tasks
  router.get("/", authenticateToken, async (req, res) => {
    try {
      const tasks = await tasksCollection.find({}).toArray();
      res.status(200).json(tasks);
    } catch (err) {
      console.error("Erro ao buscar tasks:", err);
      res.status(500).send("Erro interno");
    }
  });

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
