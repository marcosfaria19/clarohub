import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import cidadesAtlas from "../utils/cidadesAtlas";
import ufVisium from "../utils/ufVisium";
import ufNuvem from "../utils/ufNuvem";

const SublinkModal = ({ show, handleClose, selectedApp }) => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [options, setOptions] = useState([]);
  const [locationType, setLocationType] = useState("");

  useEffect(() => {
    if (selectedApp) {
      if (selectedApp.nome === "Atlas") {
        setOptions(Object.values(cidadesAtlas).flat().sort());
        setLocationType("Cidade");
      } else if (selectedApp.nome === "Visium") {
        setOptions(Object.values(ufVisium).flat());
        setLocationType("UF");
      } else if (selectedApp.nome === "Nuvem") {
        setOptions(Object.values(ufNuvem).flat().sort());
        setLocationType("UF");
      }
    }
  }, [selectedApp]);

  const handleLocationSelect = () => {
    const location = selectedLocation.trim().toLowerCase();
    if (!selectedApp) {
      console.warn("No selected app");
      return;
    }

    let selectedSubLink = null;

    if (selectedApp.nome === "Atlas") {
      for (const [subLinkName, cities] of Object.entries(cidadesAtlas)) {
        if (cities.map((city) => city.toLowerCase()).includes(location)) {
          selectedSubLink = selectedApp.subLinks.find(
            (subLink) =>
              subLink.nome.toLowerCase() === subLinkName.toLowerCase()
          );
          break;
        }
      }
    } else if (selectedApp.nome === "Visium") {
      for (const [subLinkName, ufs] of Object.entries(ufVisium)) {
        if (ufs.map((uf) => uf.toLowerCase()).includes(location)) {
          selectedSubLink = selectedApp.subLinks.find(
            (subLink) =>
              subLink.nome.toLowerCase() === subLinkName.toLowerCase()
          );
          break;
        }
      }
    } else if (selectedApp.nome === "Nuvem") {
      for (const [subLinkName, ufs] of Object.entries(ufNuvem)) {
        if (ufs.map((uf) => uf.toLowerCase()).includes(location)) {
          selectedSubLink = selectedApp.subLinks.find(
            (subLink) =>
              subLink.nome.toLowerCase() === subLinkName.toLowerCase()
          );
          break;
        }
      }
    }

    if (selectedSubLink) {
      console.log(`Opening sublink: ${selectedSubLink.rota}`);
      window.open(selectedSubLink.rota, "_blank");
    } else {
      console.warn(
        `${selectedApp.nome === "Atlas" ? "Cidade" : "UF"} não encontrada.`
      );
      alert(
        `${selectedApp.nome === "Atlas" ? "Cidade" : "UF"} não encontrada.`
      );
    }

    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Selecione a {locationType}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>{locationType}</Form.Label>
            <Form.Control
              as="select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Selecione</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleLocationSelect}>
          Selecionar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SublinkModal;
