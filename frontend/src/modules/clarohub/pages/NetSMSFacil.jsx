// NetSMSFacil.js
import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Alert,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import "./NetSMSFacil.css";
import TabelaNetFacil from "../components/TabelaNetFacil";
import axiosInstance from "../../../services/axios";

const NetSMSFacil = () => {
  const [data, setData] = useState([]);
  const [tratativa, setTratativa] = useState("");
  const [tipo, setTipo] = useState("");
  const [aberturaFechamento, setAberturaFechamento] = useState("");
  const [netsms, setNetsms] = useState("");
  const [observacao, setObservacao] = useState("");
  const [incidente, setIncidente] = useState("");
  const [showIncidenteField, setShowIncidenteField] = useState(false);
  const [showObservacaoField, setShowObservacaoField] = useState(false);
  const [concatenatedText, setConcatenatedText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [textoPadrao, setTextoPadrao] = useState("");
  const [validated, setValidated] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [tabelaConsulta, setTabelaConsulta] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/netsmsfacil`);
        setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, []);

  const handleCodigoSubmit = () => {
    const codigoNumber = codigo;
    const selectedItem = data.find((item) => item.ID === codigoNumber);
    if (selectedItem) {
      handleReset();
      setCodigo(codigo);
      setTratativa(selectedItem.TRATATIVA);
      setTipo(selectedItem.TIPO);
      setAberturaFechamento(selectedItem["ABERTURA/FECHAMENTO"]);
      setNetsms(selectedItem.NETSMS);
      setTextoPadrao(`${selectedItem.ID} - ${selectedItem["TEXTO PADRAO"]}`);
      setShowIncidenteField(selectedItem.INCIDENTE === "Sim");
      setShowObservacaoField(selectedItem.OBS === "Sim");
      setValidated(true);
    } else {
      handleReset();
      setSubmitted(true);
    }
  };

  const handleTratativaChange = (event) => {
    setTratativa(event.target.value);
    setTipo("");
    setAberturaFechamento("");
    setNetsms("");
    setTextoPadrao("");
    setShowIncidenteField(false);
    setShowObservacaoField(false);
  };

  const handleCodigoChange = (event) => {
    setCodigo(event.target.value);
  };

  const handleTipoChange = (event) => {
    setTipo(event.target.value);
    setAberturaFechamento("");
    setNetsms("");
    setTextoPadrao("");
    setShowIncidenteField(false);
    setShowObservacaoField(false);
  };

  const handleAberturaFechamentoChange = (event) => {
    setAberturaFechamento(event.target.value);
    setNetsms("");
    setTextoPadrao("");
    setShowIncidenteField(false);
    setShowObservacaoField(false);
  };

  const handleNetsmsChange = (event) => {
    setNetsms(event.target.value);
    setTextoPadrao("");
    setShowIncidenteField(false);
    setShowObservacaoField(false);
  };

  const handleObservacaoChange = (event) => {
    const value = event.target.value
      .toUpperCase() // Converter para maiúsculas
      .normalize("NFD") // Decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remover diacríticos (acentos)
      .replace(/[^A-Z0-9\s]/g, ""); // Remover caracteres especiais (exceto letras, números e espaços)
    setObservacao(value);
  };

  const handleIncidenteChange = (event) => {
    const value = event.target.value
      .toUpperCase() // Converter para maiúsculas
      .normalize("NFD") // Decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remover diacríticos (acentos)
      .replace(/[^A-Z0-9\s]/g, ""); // Remover caracteres especiais (exceto letras, números e espaços)
    setIncidente(value);
  };

  const handleTextoPadraoChange = (event) => {
    setTextoPadrao(event.target.value);
    const selectedItem = data.find(
      (item) =>
        item.TRATATIVA === tratativa &&
        item.TIPO === tipo &&
        item["ABERTURA/FECHAMENTO"] === aberturaFechamento &&
        item.NETSMS === netsms &&
        item["TEXTO PADRAO"] === event.target.value.split(" - ")[1]
    );
    setShowIncidenteField(
      selectedItem ? selectedItem.INCIDENTE === "Sim" : false
    );
    setShowObservacaoField(selectedItem ? selectedItem.OBS === "Sim" : false);
  };

  const handleReset = () => {
    setTratativa("");
    setTipo("");
    setAberturaFechamento("");
    setNetsms("");
    setTextoPadrao("");
    setObservacao("");
    setConcatenatedText("");
    setShowAlert(false);
    setValidated(false);
    setIncidente("");
    setShowIncidenteField(false);
    setShowObservacaoField(false);
    setCodigo("");
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    setSubmitted(true);
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const selectedItem = data.find(
        (item) =>
          item.TRATATIVA === tratativa &&
          item.TIPO === tipo &&
          item["ABERTURA/FECHAMENTO"] === aberturaFechamento &&
          item.NETSMS === netsms &&
          item["TEXTO PADRAO"] === textoPadrao.split(" - ")[1]
      );

      const id = selectedItem ? selectedItem.ID : "";
      let textoPadraoConcatenado = textoPadrao;
      const usuarioAtual = localStorage.getItem("userName");
      const nomeGestor = localStorage.getItem("gestor");

      textoPadraoConcatenado += incidente ? ` ${incidente}` : "";
      textoPadraoConcatenado += observacao ? `\nOBS: ${observacao}` : "";
      textoPadraoConcatenado += `\n\n${usuarioAtual} // ${nomeGestor}`;

      setConcatenatedText(textoPadraoConcatenado);
      const textArea = document.createElement("textarea");
      textArea.value = textoPadraoConcatenado;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setShowAlert(true);
      } catch (err) {
        console.error(
          "Erro ao copiar texto para a área de transferência:",
          err
        );
      }
      document.body.removeChild(textArea);
    }

    setValidated(true);
  };

  const filterData = (conditions) => {
    return data.filter((item) =>
      conditions.every(([field, value]) => item[field] === value)
    );
  };

  const getUniqueValues = (field, conditions = []) => {
    const filteredData = filterData(conditions);
    return [...new Set(filteredData.map((item) => item[field]))];
  };

  const abrirTabelaConsulta = () => {
    setTabelaConsulta(true);
  };

  const fecharTabelaConsulta = () => {
    setTabelaConsulta(false);
  };

  return (
    <Container
      className="py-5 netsmsfacil-container"
      data-bs-theme="light"
      fluid
    >
      <div className="codigo-container">
        <Form.Control
          className="codigo-input"
          type="text"
          placeholder="Cód."
          value={codigo}
          maxLength={3}
          onChange={handleCodigoChange}
          isInvalid={submitted && !codigo}
        />

        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="button-tooltip">Encontrar automaticamente</Tooltip>
          }
        >
          <Button variant="dark" onClick={handleCodigoSubmit}>
            <i className="bi bi-check-lg"></i>
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="button-tooltip">Exibir a lista de códigos</Tooltip>
          }
        >
          <Button
            variant="outline-dark"
            className="botao-info"
            onClick={abrirTabelaConsulta}
          >
            <i className="bi bi-question-lg"></i>
          </Button>
        </OverlayTrigger>

        <TabelaNetFacil
          isOpen={tabelaConsulta}
          onRequestClose={fecharTabelaConsulta}
        />
      </div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="form-group-spacing" controlId="tratativa">
          <Form.Label>Tratativa</Form.Label>
          <Form.Control
            as="select"
            value={tratativa}
            onChange={handleTratativaChange}
            required
          >
            <option value="">Selecione</option>
            {getUniqueValues("TRATATIVA").map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            Por favor, selecione uma tratativa.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="form-group-spacing" controlId="tipo">
          <Form.Label>Tipo</Form.Label>
          <Form.Control
            as="select"
            value={tipo}
            onChange={handleTipoChange}
            disabled={!tratativa}
            required
          >
            <option value="">Selecione</option>
            {getUniqueValues("TIPO", [["TRATATIVA", tratativa]]).map(
              (value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              )
            )}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            Por favor, selecione um tipo.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group
          className="form-group-spacing"
          controlId="aberturaFechamento"
        >
          <Form.Label>Abertura/Fechamento</Form.Label>
          <Form.Control
            as="select"
            value={aberturaFechamento}
            onChange={handleAberturaFechamentoChange}
            disabled={!tipo}
            required
          >
            <option value="">Selecione</option>
            {getUniqueValues("ABERTURA/FECHAMENTO", [
              ["TIPO", tipo],
              ["TRATATIVA", tratativa],
            ]).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            Por favor, selecione abertura ou fechamento.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="form-group-spacing" controlId="netsms">
          <Form.Label>NetSMS</Form.Label>
          <Form.Control
            as="select"
            value={netsms}
            onChange={handleNetsmsChange}
            disabled={!aberturaFechamento}
            required
          >
            <option value="">Selecione</option>
            {getUniqueValues("NETSMS", [
              ["ABERTURA/FECHAMENTO", aberturaFechamento],
              ["TIPO", tipo],
              ["TRATATIVA", tratativa],
            ]).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            Por favor, selecione um NetSMS.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="form-group-spacing" controlId="textoPadrao">
          <Form.Label>Texto Padrão</Form.Label>
          <Form.Control
            as="select"
            value={textoPadrao}
            onChange={handleTextoPadraoChange}
            disabled={!netsms}
            required
          >
            <option value="">Selecione</option>
            {filterData([
              ["NETSMS", netsms],
              ["ABERTURA/FECHAMENTO", aberturaFechamento],
              ["TIPO", tipo],
              ["TRATATIVA", tratativa],
            ]).map((item) => (
              <option
                key={item.ID}
                value={`${item.ID} - ${item["TEXTO PADRAO"]}`}
              >
                {`${item.ID} - ${item["TEXTO PADRAO"]}`}
              </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            Por favor, selecione um texto padrão.
          </Form.Control.Feedback>
        </Form.Group>

        {showIncidenteField && (
          <Form.Group className="form-group-spacing" controlId="incidente">
            <Form.Label>Incidente</Form.Label>
            <Form.Control
              type="text"
              value={incidente}
              onChange={handleIncidenteChange}
              required
              placeholder="Por favor insira um incidente"
            />
            <Form.Control.Feedback type="invalid">
              Por favor, preencha o campo de incidente.
            </Form.Control.Feedback>
          </Form.Group>
        )}

        <Form.Group className="form-group-spacing" controlId="observacao">
          <Form.Label>Observação</Form.Label>
          <Form.Control
            type="text"
            value={observacao}
            onChange={handleObservacaoChange}
            required={showObservacaoField}
            placeholder={
              showObservacaoField ? "Por favor insira uma observação" : ""
            }
          />
          <Form.Control.Feedback type="invalid">
            {showObservacaoField
              ? "Por favor, preencha o campo de observação."
              : "Por favor, preencha o campo de observação."}
          </Form.Control.Feedback>
        </Form.Group>
        <div className="botoes d-flex mb-3">
          <OverlayTrigger
            placement="left"
            overlay={<Tooltip id="button-tooltip">Gerar texto padrão</Tooltip>}
          >
            <Button variant="success" className="botao-gerar" type="submit">
              <i className="bi bi-copy"></i>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip id="button-tooltip">Reiniciar</Tooltip>}
          >
            <Button
              variant="danger"
              className="botao-reiniciar"
              onClick={handleReset}
            >
              <i className="bi bi-arrow-clockwise"></i>
            </Button>
          </OverlayTrigger>
        </div>

        <Alert
          variant="success"
          show={showAlert}
          onClose={() => setShowAlert(false)}
          dismissible
        >
          O texto foi copiado para a área de transferência com sucesso.
        </Alert>

        {concatenatedText && (
          <div className="mt-5">
            <p>
              <strong>Texto Padrão:</strong>
            </p>
            <Form.Control
              as="textarea"
              rows={5}
              value={concatenatedText}
              readOnly
            />
          </div>
        )}
      </Form>
    </Container>
  );
};

export default NetSMSFacil;
