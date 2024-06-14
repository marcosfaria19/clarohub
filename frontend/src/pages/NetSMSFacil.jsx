import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Alert,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import "./NetSMSFacil.css";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/netsmsfacil`
        );
        setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, []);

  const handleCodigoSubmit = () => {
    const codigoNumber = parseInt(codigo);
    const selectedItem = data.find((item) => item.ID === codigoNumber);
    if (selectedItem) {
      setTratativa(selectedItem.TRATATIVA);
      setTipo(selectedItem.TIPO);
      setAberturaFechamento(selectedItem["ABERTURA/FECHAMENTO"]);
      setNetsms(selectedItem.NETSMS);
      setTextoPadrao(`${selectedItem.ID} - ${selectedItem["TEXTO PADRAO"]}`);
      setShowIncidenteField(selectedItem.INCIDENTE === 1);
      setShowObservacaoField(selectedItem.OBS === 1);
      setValidated(true);
    } else {
      handleReset();
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
    setObservacao(event.target.value);
  };

  const handleTextoPadraoChange = (event) => {
    setTextoPadrao(event.target.value);
    // Verificar o valor do atributo "INCIDENTE" e "OBS" ao selecionar o "Texto Padrão"
    const selectedItem = data.find(
      (item) =>
        item.TRATATIVA === tratativa &&
        item.TIPO === tipo &&
        item["ABERTURA/FECHAMENTO"] === aberturaFechamento &&
        item.NETSMS === netsms &&
        item["TEXTO PADRAO"] === event.target.value.split(" - ")[1]
    );
    setShowIncidenteField(selectedItem ? selectedItem.INCIDENTE === 1 : false);
    setShowObservacaoField(selectedItem ? selectedItem.OBS === 1 : false);
  };

  const handleIncidenteChange = (event) => {
    setIncidente(event.target.value);
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
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      // Encontre o item correspondente com base nas seleções feitas nos dropdowns
      const selectedItem = data.find(
        (item) =>
          item.TRATATIVA === tratativa &&
          item.TIPO === tipo &&
          item["ABERTURA/FECHAMENTO"] === aberturaFechamento &&
          item.NETSMS === netsms &&
          item["TEXTO PADRAO"] === textoPadrao.split(" - ")[1]
      );

      // Se um item correspondente for encontrado, extraia seu ID
      const id = selectedItem ? selectedItem.ID : "";

      // Concatene todas as seleções e o ID
      let textoPadraoConcatenado = `${id} - ${textoPadrao.split(" - ")[1]}`;
      const usuarioAtual = localStorage.getItem("userName");
      const nomeGestor = localStorage.getItem("gestor");

      textoPadraoConcatenado += incidente ? ` ${incidente}` : "";
      textoPadraoConcatenado += observacao ? `\nOBS: ${observacao}` : "";
      textoPadraoConcatenado += `\n\n${usuarioAtual} // ${nomeGestor}`;

      setConcatenatedText(textoPadraoConcatenado);
      navigator.clipboard.writeText(textoPadraoConcatenado);
      setShowAlert(true);
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

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "Esquematizacao_Sistema_de_Codigos.xlsx";
    link.download = "Esquematizacao_Sistema_de_Codigos.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container className="py-5 netsmsfacil-container">
      <div className="codigo-container">
        <Form.Control
          className="codigo-input"
          type="text"
          placeholder="Cód."
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
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
            <Tooltip id="button-tooltip">Baixar lista de códigos</Tooltip>
          }
        >
          <Button
            variant="outline-dark"
            className="botao-download"
            onClick={handleDownload}
          >
            <i className="bi bi-download"></i>
          </Button>
        </OverlayTrigger>
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
