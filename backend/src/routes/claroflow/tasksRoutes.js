const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const { ObjectId } = require("mongodb");
const authenticateToken = require("../../middleware/authMiddleware");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const fs = require("fs").promises;
const path = require("path");
const { Parser } = require("json2csv");
const { parseCustomDateFromExcel } = require("../../utils/formatarData");

module.exports = (tasksCollection, usersCollection, projectsCollection) => {
  // Índices otimizados para todas as situações
  const createIndexes = async () => {
    try {
      await tasksCollection.createIndex({
        "status._id": 1,
        "assignedTo._id": 1,
        REGIONAL: 1,
        BASE: 1,
        CIDADE: 1,
        updatedAt: 1,
      });

      await tasksCollection.createIndex({
        "history.status._id": 1,
        "history.user._id": 1,
        "history.finishedAt": 1,
      });

      await tasksCollection.createIndex({ IDDEMANDA: 1 }, { unique: true });
    } catch (err) {
      console.error("Erro ao criar índices:", err);
    }
  };

  // Helper para determinar critério de ordenação
  const getSortCriteria = async (assignmentId) => {
    const project = await projectsCollection.findOne({
      "assignments._id": assignmentId,
    });

    if (!project) return { updatedAt: 1 };

    const assignment = project.assignments.find(
      (a) => a._id.toString() === assignmentId.toString()
    );

    if (assignment?.sortConfig) {
      return assignment.sortConfig.orderBy.reduce((sortObj, field) => {
        sortObj[field] = assignment.sortConfig.orderDirection;
        return sortObj;
      }, {});
    }

    return { updatedAt: 1 }; // Fallback padrão, ordenando apenas por updatedAt
  };

  // Rota modificada para assumir demanda com ordenação dinâmica
  router.patch("/take/:assignmentId", authenticateToken, async (req, res) => {
    try {
      const assignmentId = new ObjectId(req.params.assignmentId);
      const sortCriteria = await getSortCriteria(assignmentId);

      const result = await tasksCollection.findOneAndUpdate(
        {
          "status._id": assignmentId,
          assignedTo: null,
        },
        {
          $set: {
            assignedTo: {
              _id: new ObjectId(req.user.id),
              name: req.user.NOME,
            },
            updatedAt: new Date(),
          },
        },
        {
          sort: sortCriteria,
          returnDocument: "after",
        }
      );

      if (!result) {
        return res.status(404).send("Nenhuma demanda disponível");
      }

      res.status(200).json(result);
    } catch (err) {
      console.error("Erro ao assumir demanda:", err);
      res.status(500).send("Erro interno");
    }
  });

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

            // Convertendo a string DATA_INICIO para Date
            const createdAt = row.DATA_INICIO
              ? parseCustomDateFromExcel(row.DATA_INICIO)
              : null;

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
              project: {
                _id: project._id,
                name: project.name,
              },
              status: {
                _id: project.assignments[0]._id,
                name: project.assignments[0].name,
              },
              assignedTo: null,
              updatedAt: new Date(),
              createdAt: createdAt,
              history: [],
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

  // Buscar tasks por demanda/usuario (Fila Em Tratamento)
  router.get(
    "/assignment/:assignmentId/user/:userId",
    authenticateToken,
    async (req, res) => {
      try {
        const tasks = await tasksCollection
          .find({
            "status._id": new ObjectId(req.params.assignmentId),
            "assignedTo._id": new ObjectId(req.params.userId),
          })
          .toArray();

        res.status(200).json(tasks);
      } catch (err) {
        console.error("Erro:", err);
        res.status(500).send("Erro interno");
      }
    }
  );

  // Rota para buscar completed tasks por demanda/usuario

  router.get("/completed/:assignmentId/user/:userId", async (req, res) => {
    try {
      const { assignmentId, userId } = req.params;

      const tasks = await tasksCollection
        .aggregate([
          {
            $match: {
              history: {
                $elemMatch: {
                  "status._id": new ObjectId(assignmentId),
                  "user._id": new ObjectId(userId),
                  finishedAt: { $exists: true },
                },
              },
            },
          },
          {
            $addFields: {
              finishedAtByUser: {
                $first: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$history",
                        as: "entry",
                        cond: {
                          $and: [
                            {
                              $eq: [
                                "$$entry.status._id",
                                new ObjectId(assignmentId),
                              ],
                            },
                            { $eq: ["$$entry.user._id", new ObjectId(userId)] },
                            { $ifNull: ["$$entry.finishedAt", false] },
                          ],
                        },
                      },
                    },
                    as: "matchedEntry",
                    in: "$$matchedEntry.finishedAt",
                  },
                },
              },
            },
          },
        ])
        .toArray();

      res.status(200).json(tasks);
    } catch (err) {
      console.error("Erro ao buscar tasks completadas:", err);
      res.status(500).send("Erro interno");
    }
  });

  // Trocar de fila
  router.patch("/transition/:taskId", authenticateToken, async (req, res) => {
    try {
      const { newStatusId, obs, projectId } = req.body;

      // 1. Verificar se o usuário é o responsável
      const task = await tasksCollection.findOne({
        _id: new ObjectId(req.params.taskId),
        "assignedTo._id": new ObjectId(req.user.id),
      });

      if (!task) {
        return res
          .status(403)
          .send("Você não é o responsável por esta demanda");
      }

      // 2. Obter o projeto correto usando o projectId recebido
      const project = await projectsCollection.findOne({
        _id: new ObjectId(projectId),
      });

      if (!project) {
        return res.status(404).send("Projeto não encontrado");
      }

      // 3. Encontrar o novo status nas transições permitidas
      const newAssignment = project.assignments.find(
        (a) => a._id.toString() === newStatusId
      );

      if (!newAssignment) {
        return res.status(400).send("Status de destino inválido");
      }

      // 4. Atualizar task
      const result = await tasksCollection.findOneAndUpdate(
        { _id: task._id },
        {
          $set: {
            status: {
              _id: new ObjectId(newAssignment._id),
              name: newAssignment.name,
            },
            assignedTo: null,
            updatedAt: new Date(),
          },
          $push: {
            history: {
              status: task.status,
              user: {
                _id: new ObjectId(req.user.id),
                name: req.user.NOME,
              },
              startedAt: task.updatedAt,
              finishedAt: new Date(),
              newStatus: {
                _id: new ObjectId(newAssignment._id),
                name: newAssignment.name,
              },
              obs: obs || "Status alterado",
            },
          },
        },
        { returnDocument: "after" }
      );

      res.status(200).json(result.value);
    } catch (err) {
      console.error("Erro:", err);
      res.status(500).send("Erro interno");
    }
  });

  // Busca todas as tasks por demanda
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

  /* Rota para debug de ordenação de tasks 

  router.get("/debug-sort/:assignmentId", async (req, res) => {
    try {
      const assignmentId = new ObjectId(req.params.assignmentId);
      const sortCriteria = await getSortCriteria(assignmentId);

      const tasks = await tasksCollection
        .find({
          "status._id": assignmentId,
          assignedTo: null,
        })
        .sort(sortCriteria)
        .toArray();

      // Transformação customizada no campo de data
      const transformedTasks = tasks.map((item) => {
        const date = item.updatedAt;

        const excelDate = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date
          .getDate()
          .toString()
          .padStart(2, "0")} ${date
          .getHours()
          .toString()
          .padStart(2, "0")}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

        return {
          ...item,
          updatedAt: excelDate,
        };
      });

      const opts = {
        fields: [
          "REGIONAL",
          "BASE",
          "CIDADE",
          "ENDERECO_VISTORIA",
          "updatedAt",
        ],
        delimiter: ";",
        withBOM: true,
      };

      const parser = new Parser(opts);
      const csv = "\uFEFF" + parser.parse(transformedTasks);

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=tasks_${assignmentId}_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );

      res.status(200).send(csv);
    } catch (err) {
      console.error("Erro ao gerar CSV:", err);
      res.status(500).json({ error: err.message });
    }
  });*/

  // Criar índices ao iniciar
  createIndexes().catch(console.error);

  return router;
};
