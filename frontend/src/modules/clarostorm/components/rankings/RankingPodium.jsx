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
        return "h-[160px] bg-podium w-[125px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]";
      case 1:
        return "h-28 bg-podium/60 rounded-l-lg w-28";
      case 2:
        return "h-24 bg-podium/60 rounded-r-lg w-28";
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
        return "min-h-[60px] min-w-[60px] max-h-[66px] top-[38px]";
      case 2:
        return "min-h-[60px] min-w-[60px] max-h-[66px] top-[38px]";
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
        className={`relative ${getPodium()} flex flex-col items-center justify-center rounded-t-xl`}
      >
        {/* Nome */}
        <span className="relative mt-2 text-center text-sm font-semibold text-primary-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          {rank.name ? formatUserName(rank.name) : ""}
        </span>

        {/* Pontuação */}
        <span className="absolute bottom-2 text-lg font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          {rank[scoreLabel] ? rank[scoreLabel] : "0"}
        </span>
      </div>
    </div>
  );
};

export default RankingPodium;
