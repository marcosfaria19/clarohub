// Espeto.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

const Espeto = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title></Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <img
          src="https://www.icegif.com/wp-content/uploads/icegif-1617.gif"
          alt="Easter Egg GIF"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Espeto;