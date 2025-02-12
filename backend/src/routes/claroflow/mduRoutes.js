const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const { ObjectId } = require("mongodb");
const authenticateToken = require("../../middleware/authMiddleware");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

module.exports = (mduCollection) => {
  router.post(
    "/upload",
    authenticateToken,
    upload.single("file"),
    async (req, res) => {
      if (!req.file) return res.status(400).send("Nenhum arquivo foi enviado.");

      try {
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Verificar colunas obrigatórias
        const colunasEsperadas = [
          "IDDEMANDA",
          "COD_OPERADORA",
          "ENDERECO_VISTORIA",
        ];
        const headers = Object.keys(data[0] || {});
        const missingColumns = colunasEsperadas.filter(
          (col) => !headers.includes(col)
        );

        if (missingColumns.length > 0) {
          return res.status(400).send("Extração Inválida");
          /* .send(`Colunas faltantes: ${missingColumns.join(", ")}`); */
        }

        // Filtrar colunas e linhas (mantendo apenas as colunas necessárias e removendo linhas com endereço vazio)
        const processedData = data
          .map((row) => {
            const filteredRow = {};
            colunasEsperadas.forEach((col) => {
              filteredRow[col] = row[col];
            });
            return filteredRow;
          })
          .filter((row) => {
            const endereco = row.ENDERECO_VISTORIA;
            return endereco && endereco.toString().trim() !== "";
          });

        // Se houver dados processados, verifica duplicidade e insere apenas os novos
        if (processedData.length > 0) {
          // Obtém todos os IDDEMANDA dos registros processados
          const ids = processedData.map((row) => row.IDDEMANDA);
          // Busca no banco os registros que já possuem algum desses IDs
          const existingDocs = await mduCollection
            .find({ IDDEMANDA: { $in: ids } })
            .toArray();
          const existingIDs = existingDocs.map((doc) => doc.IDDEMANDA);
          // Filtra para manter apenas os registros cujo IDDEMANDA ainda não existe no banco
          const newData = processedData.filter(
            (row) => !existingIDs.includes(row.IDDEMANDA)
          );

          // Realiza a inserção somente se houver registros novos
          if (newData.length > 0) {
            await mduCollection.insertMany(newData, { ordered: false });
          }

          return res.status(200).json({
            message: "Arquivo processado com sucesso",
            originalRows: data.length,
            insertedRows: newData.length,
          });
        } else {
          return res.status(200).json({
            message: "Nenhuma linha para processar",
            originalRows: data.length,
            insertedRows: 0,
          });
        }
      } catch (err) {
        console.error("Erro no processamento:", err);
        res.status(500).send("Erro durante o processamento do arquivo");
      }
    }
  );

  router.get("/", authenticateToken, async (req, res) => {
    try {
      const docs = await mduCollection.find({}).toArray();
      res.json(docs);
    } catch (err) {
      console.error("Erro ao consultar o banco de dados:", err);
      res.status(500).send("Erro ao consultar o banco de dados.");
    }
  });

  router.delete("/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      const result = await mduCollection.deleteOne({
        _id: new ObjectId(id),
      });
      if (result.deletedCount === 0) {
        return res
          .status(404)
          .send("Nenhum dado foi deletado. ID não encontrado.");
      }
      res.send("Dado deletado com sucesso.");
    } catch (err) {
      console.error("Erro ao deletar o dado do banco de dados:", err);
      res.status(500).send("Erro ao deletar o dado do banco de dados.");
    }
  });

  // Rota para editar dados existente
  router.put("/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    delete newData._id;

    try {
      const result = await mduCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: newData }
      );
      if (result.matchedCount === 0) {
        return res
          .status(404)
          .json({ message: "Nenhum documento foi atualizado" });
      }
      res.send("Dados atualizados com sucesso");
    } catch (err) {
      console.error("Erro ao atualizar dados no banco de dados:", err);
      res
        .status(500)
        .json({ message: "Erro ao atualizar dados no banco de dados" });
    }
  });

  return router;
};
