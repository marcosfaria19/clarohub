// components/AppCard.js

import React from "react";
import { Card } from "react-bootstrap";
import "./AppCard.css";

const AppCard = ({ nome, descricao, logoCard, imagemUrl }) => {
  return (
    <Card className="app-card">
      <Card.Body className="card-body d-flex">
        <Card.Title className="card-color">{nome}</Card.Title>

        <img src={imagemUrl} alt={nome} className="card-background" />
        <img src={logoCard} alt={nome} className="card-logo" />
      </Card.Body>
    </Card>
  );
};

export default AppCard;
