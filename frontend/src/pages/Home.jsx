import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [permissions, setPermissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/permissions", {
          headers: {
            Authorization: token,
          },
        });
        setPermissions(response.data.permissions);
      } catch (error) {
        console.error("Erro ao buscar permissões:", error);
        navigate("/login");
      }
    };

    fetchPermissions();
  }, [navigate]);

  const apps = [
    { name: "Qualinet", route: "/qualinet" },
    { name: "NetSmsFacil", route: "/netsmsfacil" },
  ];

  return (
    <Container>
      <Row>
        {apps.map((app) =>
          permissions.includes(app.name.toLowerCase()) ? (
            <Col key={app.name} md={4}>
              <Card onClick={() => navigate(app.route)}>
                <Card.Body>
                  <Card.Title>{app.name}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ) : null
        )}
      </Row>
    </Container>
  );
}

export default Home;
