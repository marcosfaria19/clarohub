import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AppCard from "../components/AppCard";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Home.css";

const Home = () => {
  const [groupedApps, setGroupedApps] = useState({});

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/apps`)
      .then((response) => {
        const appsData = response.data;
        console.log("Dados recebidos:", appsData);
        const filteredApps = filterAppsByPermissions(appsData);
        const groupedApps = groupAppsByFamily(filteredApps);
        setGroupedApps(groupedApps);
      })
      .catch((error) => console.error("Erro ao buscar aplicativos:", error));
  }, []);

  const filterAppsByPermissions = (apps) => {
    const token = localStorage.getItem("token");
    if (!token) return [];
    const decodedToken = jwtDecode(token);
    const userAccessLevel = decodedToken.PERMISSOES || "";

    const accessHierarchy = {
      basic: ["basic"],
      manager: ["basic", "manager"],
      admin: ["basic", "manager", "admin"],
    };

    const accessibleFamilies = accessHierarchy[userAccessLevel] || [];

    return apps.filter((app) => accessibleFamilies.includes(app.acesso));
  };

  const groupAppsByFamily = (apps) => {
    return apps.reduce((groups, app) => {
      const family = app.familia;
      if (!groups[family]) {
        groups[family] = [];
      }
      groups[family].push(app);
      return groups;
    }, {});
  };

  const desiredOrder = [
    "Projetos",
    "Plataformas",
    "PowerApps",
    "SharePoint",
    "Visium",
    "Nuvem",
    "Gestão",
  ];

  return (
    <Container className="home-container" fluid>
      <h2 className="mb-5">Meus Aplicativos</h2>
      {desiredOrder.map(
        (family) =>
          groupedApps[family] && (
            <div key={family} className="family-section mb-5">
              <h2 className="family-title">{family}</h2>
              <Row xs={1} sm={2} md={3} lg={5} className="g-4">
                {groupedApps[family]?.map((app) => (
                  <Col key={app._id}>
                    <AppCard
                      nome={app.nome}
                      imagemUrl={`${process.env.REACT_APP_BACKEND_URL}${app.imagemUrl}`}
                      logoCard={`${process.env.REACT_APP_BACKEND_URL}${app.logoCard}`}
                      rota={app.rota}
                    />
                  </Col>
                ))}
              </Row>
              <hr className="family-divider" />
            </div>
          )
      )}
      {/* Renderizar outras famílias não listadas na ordem desejada */}
      {Object.keys(groupedApps)
        .filter((family) => !desiredOrder.includes(family))
        .map(
          (family) =>
            groupedApps[family] && (
              <div key={family} className="family-section mb-5">
                <h2 className="family-title">{family}</h2>
                <Row xs={1} sm={2} md={3} lg={5} className="g-4">
                  {groupedApps[family]?.map((app) => (
                    <Col key={app._id}>
                      <AppCard
                        nome={app.nome}
                        imagemUrl={`${process.env.REACT_APP_BACKEND_URL}${app.imagemUrl}`}
                        logoCard={`${process.env.REACT_APP_BACKEND_URL}${app.logoCard}`}
                        rota={app.rota}
                      />
                    </Col>
                  ))}
                </Row>
                <hr className="family-divider" />
              </div>
            )
        )}
    </Container>
  );
};

export default Home;
