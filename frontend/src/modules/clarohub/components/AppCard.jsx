import React from "react";
import "./AppCard.css";
import { BsStar, BsStarFill } from "react-icons/bs";

const AppCard = ({
  nome,
  imagemUrl,
  logoCard,
  rota,
  onCardClick,
  isFavorite,
  onFavoriteClick,
}) => {
  const handleClick = (e) => {
    if (rota === "multi-rotas") {
      e.preventDefault();
      onCardClick();
    }
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteClick();
  };

  return (
    <div className="app-card">
      <a
        href={rota !== "multi-rotas" ? rota : "/"}
        target={rota !== "multi-rotas" ? "_blank" : "_self"}
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        <div
          className="app-favoritos"
          onClick={handleFavoriteClick}
        >
          {isFavorite ? <BsStarFill /> : <BsStar />}
        </div>
        <div
          className="app-card-cover"
          style={{ backgroundImage: `url(${imagemUrl})` }}
        >
          <div className="card-title-overlay">
            <h2 className="app-name">{nome}</h2>
          </div>
          <img
            src={logoCard}
            alt={nome}
            className="card-logo"
          />
        </div>
      </a>
    </div>
  );
};

export default AppCard;
