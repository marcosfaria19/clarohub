// src/routes/cardRoutes.js

const express = require("express");
const router = express.Router();

module.exports = (cardsCollection, pusher) => {
  // Rota para obter todos os cartões
  router.get("/cards", async (req, res) => {
    try {
      const cards = await cardsCollection.find({}).toArray(); // Busca todos os cartões
      res.status(200).json(cards);
    } catch (error) {
      console.error("Erro ao buscar cartões:", error);
      res.status(500).json({ error: "Error fetching cards" });
    }
  });

  // Rota para criar um novo cartão
  router.post("/add-card", async (req, res) => {
    try {
      const newCard = req.body;

      // Insere o cartão no banco de dados
      const result = await cardsCollection.insertOne(newCard);

      // Disparar evento no Pusher para atualizar os clientes
      pusher.trigger("kanban-channel", "new-card", {
        card: newCard,
      });

      res
        .status(201)
        .json({ message: "Card created successfully", card: newCard });
    } catch (error) {
      console.error("Erro ao criar cartão:", error);
      res.status(500).json({ error: "Error creating card" });
    }
  });

  return router;
};
