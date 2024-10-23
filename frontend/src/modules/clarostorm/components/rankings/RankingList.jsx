import React from "react";

const RankingList = ({ rankings, scoreLabel, userId }) => {
  const userIndex = rankings.findIndex((rank) => rank._id === userId);
  const topRankings = rankings.slice(0, 4);
  const userRanking = userIndex > 4 ? rankings[userIndex] : null;

  return (
    <div className="space-y-2">
      {topRankings.map((rank, index) => (
        <div
          key={rank._id}
          className="flex items-center justify-between rounded p-2 transition-colors hover:bg-gray-100"
        >
          <div className="flex items-center">
            <span className="mr-4 w-8 text-right">{index + 1}º</span>
            <img
              src={
                rank.creatorAvatar || rank.avatar || "/placeholder-avatar.png"
              }
              alt={rank.creatorName || rank.NOME}
              className="mr-2 h-8 w-8 rounded-full object-cover"
            />
            <span>{rank.creatorName || rank.NOME}</span>
          </div>
          <span>{rank[scoreLabel]}</span>
        </div>
      ))}
      {userRanking && (
        <>
          <div className="text-center">...</div>
          <div
            key={userRanking._id}
            className="flex items-center justify-between rounded p-2 transition-colors hover:bg-gray-100"
          >
            <div className="flex items-center">
              <span className="mr-4 w-8 text-right">{userIndex + 1}º</span>
              <img
                src={
                  userRanking.creatorAvatar ||
                  userRanking.avatar ||
                  "/placeholder-avatar.png"
                }
                alt={userRanking.creatorName || userRanking.NOME}
                className="mr-2 h-8 w-8 rounded-full object-cover"
              />
              <span>{userRanking.creatorName || userRanking.NOME}</span>
            </div>
            <span>{userRanking[scoreLabel]}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default RankingList;
