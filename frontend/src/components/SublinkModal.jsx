import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import cidadesAtlas from "../utils/cidadesAtlas";
import ufVisium from "../utils/ufVisium";
import ufNuvem from "../utils/ufNuvem";

const SublinkModal = ({ show, handleClose, selectedApp }) => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (selectedApp) {
      if (selectedApp.nome === "Atlas") {
        setOptions(Object.values(cidadesAtlas).flat().sort());
      } else if (selectedApp.nome === "Visium") {
        setOptions(Object.values(ufVisium).flat());
      } else if (selectedApp.nome === "Nuvem") {
        setOptions(Object.values(ufNuvem).flat().sort());
      }
    }
  }, [selectedApp]);

  const handleLocationSelect = () => {
    const location = selectedLocation.trim().toLowerCase();
    if (!selectedApp) {
      console.warn("No selected app");
      return;
    }

    console.log(`Selected Location: ${selectedLocation}`);

    let selectedSubLink = null;

    if (selectedApp.nome === "Atlas") {
      console.log("Handling Atlas logic");
      for (const [subLinkName, cities] of Object.entries(cidadesAtlas)) {
        if (cities.map((city) => city.toLowerCase()).includes(location)) {
          selectedSubLink = selectedApp.subLinks.find(
            (subLink) =>
              subLink.nome.toLowerCase() === subLinkName.toLowerCase()
          );
          console.log(`Found sublink for Atlas: ${selectedSubLink?.rota}`);
          break;
        }
      }
    } else if (selectedApp.nome === "Visium") {
      console.log("Handling Visium logic");
      for (const [subLinkName, ufs] of Object.entries(ufVisium)) {
        if (ufs.map((uf) => uf.toLowerCase()).includes(location)) {
          selectedSubLink = selectedApp.subLinks.find(
            (subLink) =>
              subLink.nome.toLowerCase() === subLinkName.toLowerCase()
          );
          console.log(`Found sublink for Visium: ${selectedSubLink?.rota}`);
          break;
        }
      }
    } else if (selectedApp.nome === "Nuvem") {
      console.log("Handling Nuvem logic");
      for (const [subLinkName, ufs] of Object.entries(ufNuvem)) {
        if (ufs.map((uf) => uf.toLowerCase()).includes(location)) {
          selectedSubLink = selectedApp.subLinks.find(
            (subLink) =>
              subLink.nome.toLowerCase() === subLinkName.toLowerCase()
          );
          console.log(`Found sublink for Nuvem: ${selectedSubLink?.rota}`);
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
        <Modal.Title>
          Selecione a {selectedApp?.nome === "Atlas" ? "Cidade" : "UF"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>
              {selectedApp?.nome === "Atlas" ? "Cidade" : "UF"}
            </Form.Label>
            <Form.Control
              as="select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">
                Selecione uma {selectedApp?.nome === "Atlas" ? "cidade" : "UF"}
              </option>
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
