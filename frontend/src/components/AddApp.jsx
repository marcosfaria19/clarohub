import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const AddApp = ({
  show,
  handleClose,
  handleSave,
  currentItem,
  handleChange,
  isEditMode,
}) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [logoCardUrls, setLogoCardUrls] = useState([]);
  const [logoListUrls, setLogoListUrls] = useState([]);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;

        // Ajuste para obter o conteúdo do diretório
        const cardsResponse = await axios.get(`${backendUrl}/apps/cards`);
        const logosResponse = await axios.get(`${backendUrl}/apps/logos`);

        const formatUrlsCards = (data) => {
          return data.map((filename) => `/assets/cards/${filename}`);
        };
        const formatUrlsLogos = (data) => {
          return data.map((filename) => `/assets/logos/${filename}`);
        };

        setImageUrls(formatUrlsCards(cardsResponse.data));
        setLogoCardUrls(formatUrlsLogos(logosResponse.data));
        setLogoListUrls(formatUrlsLogos(logosResponse.data));
      } catch (error) {
        console.error("Erro ao buscar URLs de imagens e logos", error);
      }
    };

    fetchUrls();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditMode ? "Editar App" : "Adicionar Novo App"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNome">
            <Form.Label>NOME</Form.Label>
            <Form.Control
              type="text"
              name="nome"
              value={currentItem.nome}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formImgUrl">
            <Form.Label>IMAGEM CARD</Form.Label>
            <Form.Control
              as="select"
              name="imagemUrl"
              value={currentItem.imagemUrl}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              {imageUrls.map((url) => (
                <option key={url} value={`${url}`}>
                  {url}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formLogoCard">
            <Form.Label>LOGO CARD</Form.Label>
            <Form.Control
              as="select"
              name="logoCard"
              value={currentItem.logoCard}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              {logoCardUrls.map((url) => (
                <option key={url} value={`${url}`}>
                  {url}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formLogoList">
            <Form.Label>LOGO LISTA</Form.Label>
            <Form.Control
              as="select"
              name="logoList"
              value={currentItem.logoList}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              {logoListUrls.map((url) => (
                <option key={url} value={`${url}`}>
                  {url}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formRota">
            <Form.Label>ROTA</Form.Label>
            <Form.Control
              type="text"
              name="rota"
              value={currentItem.rota}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formFamilia">
            <Form.Label>FAMILIA</Form.Label>
            <Form.Control
              type="text"
              name="familia"
              value={currentItem.familia}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formAcesso">
            <Form.Label>ACESSO</Form.Label>
            <Form.Control
              as="select"
              name="acesso"
              value={currentItem.acesso}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="basic">Basic</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {isEditMode ? "Salvar" : "Adicionar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddApp;
