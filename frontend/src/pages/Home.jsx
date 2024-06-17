import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AppCard from "../components/AppCard";
import axios from "axios";

const Home = () => {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/apps`)
      .then((response) => {
        console.log("Dados recebidos:", response.data);
        setApps(response.data);
      })
      .catch((error) => console.error("Erro ao buscar aplicativos:", error));
  }, []);

  return (
    <Container className="home-container mb-5">
      <h1 className="mt-5 mb-3">Biblioteca de Aplicativos</h1>
      <Row xs={1} md={2} lg={4} className="g-4">
        {apps.map((app) => (
          <Col key={app._id}>
            <AppCard
              nome={app.nome}
              descricao={app.descricao}
              imagemUrl={`${process.env.REACT_APP_BACKEND_URL}${app.imagemUrl}`}
              logoCard={`${process.env.REACT_APP_BACKEND_URL}${app.logoCard}`}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;
