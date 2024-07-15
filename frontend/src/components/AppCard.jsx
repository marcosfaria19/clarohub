import React from "react";
import "./AppCard.css";

const AppCard = ({ nome, imagemUrl, logoCard, rota, onCardClick }) => {
  const handleClick = (e) => {
    if (rota === "multi-rotas") {
      e.preventDefault();
      onCardClick();
    }
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
          className="app-card-cover"
          style={{ backgroundImage: `url(${imagemUrl})` }}
        >
          <div className="card-title-overlay">
            <h2 className="app-name">{nome}</h2>
          </div>
          <img src={logoCard} alt={nome} className="card-logo" />
        </div>
      </a>
    </div>
  );
};

export default AppCard;
