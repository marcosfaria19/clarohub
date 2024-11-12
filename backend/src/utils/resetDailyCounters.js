// src/utils/resetDailyCounters.js

const moment = require("moment");
const { ObjectId } = require("mongodb");

// Função que reseta contadores se for um novo dia
const resetDailyCountersIfNeeded = async (userId, usersCollection) => {
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
  const today = moment().startOf("day"); // Pega o início do dia atual
  const lastActivity = moment(user.lastActivityDate || new Date(0)).startOf(
    "day"
  ); // Última data de atividade do usuário

  // Se o último login não for hoje, reseta os contadores
  if (!lastActivity.isSame(today)) {
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          dailyLikesUsed: 0,
          dailyIdeasCreated: 0,
          lastActivityDate: today.toDate(),
        },
      }
    );
  }
};

module.exports = resetDailyCountersIfNeeded;
