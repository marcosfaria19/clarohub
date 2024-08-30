import axiosInstance from "services/axios";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddNetSMSFacil = ({
  show,
  handleClose,
  handleSave,
  currentItem,
  handleChange,
  isEditMode,
}) => {
  const [sgdOptions, setSgdOptions] = useState([]);

  useEffect(() => {
    const fetchSgdOptions = async () => {
      try {
        const response = await axiosInstance.get("/netfacilsgd");
        const uniqueSgds = [
          ...new Set(response.data.map((item) => item.ID_SGD)),
        ];
        setSgdOptions(uniqueSgds);
      } catch (error) {
        console.error("Erro ao buscar dados do SGD:", error);
      }
    };

    fetchSgdOptions();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  const handleMultiSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value,
    );
    handleChange({
      target: {
        name: e.target.name,
        value: selectedOptions,
      },
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditMode ? "Editar Código" : "Adicionar Novo Código"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formId">
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="number"
              name="ID"
              value={currentItem.ID}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formTratativa">
            <Form.Label>TRATATIVA</Form.Label>
            <Form.Control
              as="select"
              name="TRATATIVA"
              value={currentItem.TRATATIVA}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="TAP">TAP</option>
              <option value="NAP">NAP</option>
              <option value="MDU">MDU</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formTipo">
            <Form.Label>TIPO</Form.Label>
            <Form.Control
              as="select"
              name="TIPO"
              value={currentItem.TIPO}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="TP1">TP1</option>
              <option value="TP2">TP2</option>
              <option value="TP3">TP3</option>
              <option value="VT1">VT1</option>
              <option value="VT2">VT2</option>
              <option value="VT3">VT3</option>
              <option value="NP1">NP1</option>
              <option value="NP2">NP2</option>
              <option value="NP3">NP3</option>
              <option value="MD1">MD1</option>
              <option value="MD3">MD3</option>
              <option value="SAR">SAR</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formAberturaFechamento">
            <Form.Label>ABERTURA/FECHAMENTO</Form.Label>
            <Form.Control
              as="select"
              name="ABERTURA/FECHAMENTO"
              value={currentItem["ABERTURA/FECHAMENTO"]}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="ABERTURA">ABERTURA</option>
              <option value="FECHAMENTO">FECHAMENTO</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formNetsms">
            <Form.Label>NETSMS</Form.Label>
            <Form.Control
              type="text"
              name="NETSMS"
              value={currentItem.NETSMS}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formTextoPadrao">
            <Form.Label>TEXTO PADRÃO</Form.Label>
            <Form.Control
              type="text"
              name="TEXTO PADRAO"
              value={currentItem["TEXTO PADRAO"]}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formObs">
            <Form.Label>OBS Obrigatório</Form.Label>
            <Form.Control
              as="select"
              name="OBS"
              value={currentItem.OBS}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formIncidente">
            <Form.Label>Incidente Obrigatório</Form.Label>
            <Form.Control
              as="select"
              name="INCIDENTE"
              value={currentItem.INCIDENTE}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formSgd">
            <Form.Label>Fechamento SGD</Form.Label>
            <Form.Control
              as="select"
              name="SGD"
              value={currentItem.SGD || []}
              onChange={handleMultiSelectChange}
              multiple
            >
              {sgdOptions.map((id) => (
                <option key={id} value={id}>
                  {id}
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
        <Button variant="primary" onClick={handleSave}>
          {isEditMode ? "Salvar" : "Adicionar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddNetSMSFacil;
