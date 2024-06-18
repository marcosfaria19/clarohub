import React from "react";
import "./AppCard.css";

const AppCard = ({ nome, imagemUrl, logoCard, rota }) => {
  // Verifica se a rota é uma URL externa
  const isExternalLink = rota.startsWith("http");
  const routeWithoutHome = rota.startsWith("/home") ? rota.substring(5) : rota;

  return (
    <div className="app-card">
      {isExternalLink ? (
        // Se for uma URL externa, renderiza um link <a>
        <a href={rota} target="_blank" rel="noopener noreferrer">
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
      ) : (
        // Se for uma rota interna, renderiza um link <Link>
        <a href={routeWithoutHome} rel="noopener noreferrer">
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
      )}
    </div>
  );
};

export default AppCard;
