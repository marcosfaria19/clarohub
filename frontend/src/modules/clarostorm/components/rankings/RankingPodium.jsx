import React from "react";
import ouro from "modules/clarostorm/assets/ouro.png";
import prata from "modules/clarostorm/assets/prata.png";
import bronze from "modules/clarostorm/assets/bronze.png";
import formatUserName from "modules/shared/utils/formatUsername";

const RankingPodium = ({ rank, index, scoreLabel }) => {
  if (!rank) return null;

  const getPodium = () => {
    switch (index) {
      case 0:
        return "h-36 bg-card/40 border-yellow-500";
      case 1:
        return "h-32 bg-card/80 border-gray-400 rounded-l-lg";
      case 2:
        return "h-28 bg-card/90 border-yellow-900 rounded-r-lg";
      default:
        return "";
    }
  };

  const getMedalImage = () => {
    switch (index) {
      case 0:
        return ouro;
      case 1:
        return prata;
      case 2:
        return bronze;
      default:
        return null;
    }
  };

  const getAvatarSize = () => {
    switch (index) {
      case 0:
        return "min-h-[75px] min-w-[75px] max-h-[75px] top-[60px] right-3";
      case 1:
        return "min-h-[60px] min-w-[60px] max-h-[65px] top-[40px]";
      case 2:
        return "min-h-[60px] min-w-[60px] max-h-[65px] top-[40px]";
      default:
        return null;
    }
  };
  const getMedalSize = () => {
    switch (index) {
      case 0:
        return "min-h-[100px] min-w-[100px] max-h-[120px] top-[31px] right-1";
      case 1:
        return "min-h-[50px] min-w-[50px] max-h-[90px] max-w-[77px] top-[34px]";
      case 2:
        return "min-h-[50px] min-w-[50px] max-h-[90px] max-w-[77px] top-[34px]";
      default:
        return null;
    }
  };

  const medalImage = getMedalImage();

  return (
    <div className="relative flex flex-col items-center">
      {/* Avatar e medalha */}
      {medalImage && (
        <div className="relative flex flex-col items-center">
          <img
            src={medalImage}
            className={`relative ${getMedalSize()} z-20 object-contain`}
            alt={`Medalha: ${index + 1}`}
          />
          <img
            src={rank.avatar || "/placeholder-avatar.png"}
            alt={rank.name}
            className={`absolute ${getAvatarSize()} z-10 rounded-full`}
          />
        </div>
      )}
      {/* Podium */}
      <div
        className={`relative ${getPodium()} flex w-28 flex-col items-center justify-center rounded-t-lg border-t-4`}
      >
        {/* Nome */}
        <span className="relative bottom-4 mt-2 text-center text-sm font-semibold text-foreground">
          {rank.name ? formatUserName(rank.name) : ""}
        </span>

        {/* Pontuação */}
        <span className="absolute bottom-9 text-sm font-bold">
          {rank[scoreLabel] ? rank[scoreLabel] : "0"}
        </span>
      </div>
    </div>
  );
};

export default RankingPodium;
