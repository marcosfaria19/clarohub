import formatUserName from "modules/shared/utils/formatUsername";
import React from "react";

export default function RankingList({ rankings, scoreLabel, userId }) {
  const userIndex = rankings.findIndex((rank) => rank.userId === userId);
  const userRanking = userIndex !== -1 ? rankings[userIndex] : null;

  let rankingsToShow = [];
  if (userIndex >= 3 && userIndex <= 6) {
    // Usuário está na lista de ranking do top 4 ao 7
    rankingsToShow = rankings.slice(0, 4);
  } else if (userIndex > 6) {
    // Usuário está fora do top 7
    rankingsToShow = [...rankings.slice(0, 3), rankings[userIndex]];
  } else {
    // Usuário está no top 3
    rankingsToShow = rankings.slice(0, 4);
  }

  return (
    <div className="mx-5 space-y-2 rounded-full px-3">
      {rankingsToShow.map((rank, index) => {
        const actualPosition =
          rank.userId === userId && userIndex > 4 ? userIndex + 1 : index + 4;
        const isUserRanking = rank.userId === userId;

        return (
          <div
            key={rank.userId}
            className={`flex items-center justify-between rounded-full p-3 transition-colors hover:bg-gray-100 ${
              isUserRanking ? "bg-blue-100" : ""
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
