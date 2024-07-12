import React, { useState, useEffect } from "react";
import { Container, Row, Col, Modal, Button, Form } from "react-bootstrap";
import AppCard from "../components/AppCard";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import cidadesAtlas from "../utils/cidadesAtlas";
import "./Home.css";

const Home = () => {
  const [groupedApps, setGroupedApps] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/apps`)
      .then((response) => {
        const appsData = response.data;
        const filteredApps = filterAppsByPermissions(appsData);
        const groupedApps = groupAppsByFamily(filteredApps);
        setGroupedApps(groupedApps);
      })
      .catch((error) => console.error("Erro ao buscar aplicativos:", error));
  }, []);

  const filterAppsByPermissions = (apps) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found");
      return [];
    }
    let decodedToken;
    try {
      decodedToken = jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return [];
    }
    const userAccessLevel = decodedToken.PERMISSOES || "";

    const accessHierarchy = {
      guest: ["guest"],
      basic: ["guest", "basic"],
      manager: ["guest", "basic", "manager"],
      admin: ["guest", "basic", "manager", "admin"],
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

  const handleCardClick = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedApp(null);
    setSelectedCity("");
  };

  const handleCitySelect = () => {
    const city = selectedCity.trim().toLowerCase();
    if (!selectedApp || !selectedApp.subLinks) return;

    let selectedSubLink = null;

    for (const [subLinkName, cities] of Object.entries(cidadesAtlas)) {
      if (cities.map((city) => city.toLowerCase()).includes(city)) {
        selectedSubLink = selectedApp.subLinks.find(
          (subLink) => subLink.nome.toLowerCase() === subLinkName.toLowerCase()
        );
        break;
      }
    }

    if (selectedSubLink) {
      window.open(selectedSubLink.rota, "_blank");
    } else {
      alert("Cidade não encontrada.");
    }

    handleModalClose();
  };

  const desiredOrder = [
    "Projetos",
    "Plataformas",
    "PowerApps",
    "SharePoint",
    "Visium",
    "Nuvem",
    "Atlas",
    "Gestão",
  ];

  const allCities = Object.values(cidadesAtlas).flat();

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
                      onCardClick={() => handleCardClick(app)}
                    />
                  </Col>
                ))}
              </Row>
              <hr className="family-divider" />
            </div>
          )
      )}
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
                        onCardClick={() => handleCardClick(app)}
                      />
                    </Col>
                  ))}
                </Row>
                <hr className="family-divider" />
              </div>
            )
        )}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Selecione a Cidade</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Cidade</Form.Label>
              <Form.Control
                as="select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Selecione uma cidade</option>
                {allCities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCitySelect}>
            Selecionar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Home;
