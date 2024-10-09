// src/routes/ideaRoutes.js

const express = require("express");
const router = express.Router();

module.exports = (ideasCollection, pusher) => {
  // Rota para obter todos os cartões
  router.get("/ideas", async (req, res) => {
    try {
      const ideas = await ideasCollection.find({}).toArray(); // Busca todos os cartões
      res.status(200).json(ideas);
    } catch (error) {
      console.error("Erro ao buscar cartões:", error);
      res.status(500).json({ error: "Error fetching ideas" });
    }
  });

  // Rota para criar um novo cartão
  router.post("/add-idea", async (req, res) => {
    try {
      const newIdea = req.body;

      // Insere o cartão no banco de dados
      const result = await ideasCollection.insertOne(newIdea);

      // Disparar evento no Pusher para atualizar os clientes
      pusher.trigger("claro-storm", "new-idea", {
        card: newIdea,
      });

      res
        .status(201)
        .json({ message: "Card created successfully", idea: newIdea });
    } catch (error) {
      console.error("Erro ao criar idea:", error);
      res.status(500).json({ error: "Error creating card" });
    }
  });

  return router;
};
