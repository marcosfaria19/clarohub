import formatUserName from "modules/shared/utils/formatUsername";
import React from "react";

const RankingList = ({ rankings, scoreLabel, userId }) => {
  const userIndex = rankings.findIndex((rank) => rank.userId === userId);
  const topRankings = rankings.slice(0, 4); // Posicoes de 4 até 7 do ranking
  const userRanking = userIndex !== -1 ? rankings[userIndex] : null; // Verifica se o usuário está nos rankings

  return (
    <div className="max-w-[400px] space-y-2">
      {/* Renderiza a lista depois dos 4 primeiros */}
      {topRankings.map((rank, index) => (
        <div
          key={rank.userId}
          className="flex items-center justify-between rounded p-2 transition-colors hover:bg-gray-100"
        >
          <div className="flex items-center">
            <span className="mr-4 w-8 text-right">{index + 4}º</span>
            <img
              src={rank.avatar || "/placeholder-avatar.png"}
              alt={rank.name}
              className="mr-2 h-8 w-8 rounded-full object-cover"
            />
            <span>{formatUserName(rank.name)}</span>
          </div>
          <span>{rank[scoreLabel]}</span>
        </div>
      ))}

      {/* Renderiza "..." se o usuário não estiver entre os 4 primeiros */}
      {userRanking && userIndex >= 4 && (
        <>
          <div className="text-center">...</div>
          <div
            key={userRanking._id}
            className="flex items-center justify-between rounded p-2 transition-colors hover:bg-gray-100"
          >
            <div className="flex items-center">
              <span className="mr-4 w-8 text-right">{userIndex + 4}º</span>
              <img
                src={userRanking.avatar || "/placeholder-avatar.png"}
                alt={userRanking.name}
                className="mr-2 h-8 w-8 rounded-full object-cover"
              />
              <span>{formatUserName(userRanking.name)}</span>
            </div>
            <span>{userRanking[scoreLabel]}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default RankingList;
