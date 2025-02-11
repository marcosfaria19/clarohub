import formatUserName from "modules/shared/utils/formatUsername";
import React from "react";

export default function RankingList({ rankings, scoreLabel, userId }) {
  // Encontra o índice do usuário na lista completa
  const userIndex = rankings.findIndex((rank) => rank.userId === userId);

  let rankingsToShow = [];
  if (userIndex > 3) {
    // Caso 3: usuário está fora do top 7
    // Exibe os rankings do 4º ao 6º e, na 7ª posição, o ranking do usuário
    rankingsToShow = [...rankings.slice(0, 3), rankings[userIndex]];
  } else {
    // Caso 1 e 2: usuário está no podium OU entre o 4º e 7º
    // Exibe os rankings do 4º ao 7º
    rankingsToShow = rankings.slice(0, 4);
  }

  return (
    <div className="mx-5 mt-5 space-y-2 rounded-lg px-3">
      {rankingsToShow.map((rank, index) => {
        // Se for o ranking do usuário, exibe a posição real; caso contrário, ajusta
        const actualPosition =
          rank.userId === userId ? userIndex + 4 : index + 4;

        return (
          <div
            key={rank.userId}
            className={`flex items-center justify-between rounded-full p-3 text-foreground transition-colors hover:bg-podium hover:text-primary-foreground ${
              rank.userId === userId
                ? "bg-podium text-primary-foreground"
                : "bg-secondary"
            }`}
          >
            <div className="flex items-center">
              <span className="ml-2 w-8 text-left">{actualPosition}º</span>
              <img
                src={rank.avatar || "/placeholder-avatar.png"}
                alt={rank.name}
                className="mr-2 h-8 w-8 rounded-full object-cover"
              />
              <span>{formatUserName(rank.name)}</span>
            </div>
            <span className="mr-2">{rank[scoreLabel]}</span>
          </div>
        );
      })}
    </div>
  );
}
