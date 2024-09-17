// NetSMSFacil.js
import React, { useState, useEffect } from "react";
import { Form, Container, Alert, Table } from "react-bootstrap";
import TabelaNetFacil from "modules/clarohub/components/TabelaNetFacil";
import axiosInstance from "services/axios";
import { Button } from "modules/shared/components/ui/button";

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
  const [sgdData, setSgdData] = useState([]);

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

  const findSelectedItem = (codigo) => {
    const codigoNumber = String(codigo);
    const selectedItem = data.find((item) => String(item.ID) === codigoNumber);
    return selectedItem;
  };

  const handleCodigoSubmit = () => {
    const item = findSelectedItem(codigo);
    if (item) {
      handleReset();
      setCodigo(codigo);
      setTratativa(item.TRATATIVA);
      setTipo(item.TIPO);
      setAberturaFechamento(item["ABERTURA/FECHAMENTO"]);
      setNetsms(item.NETSMS);
      setTextoPadrao(`${item.ID} - ${item["TEXTO PADRAO"]}`);
      setShowIncidenteField(item.INCIDENTE === "Sim");
      setShowObservacaoField(item.OBS === "Sim");
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

  const removerAcentos = (event) => {
    const value = event.target.value
      .toUpperCase() // Converter para maiúsculas
      .normalize("NFD") // Decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remover diacríticos (acentos)
      .replace(/[^A-Z0-9\s]/g, ""); // Remover caracteres especiais (exceto letras, números e espaços)
    setObservacao(value);
  };

  const handleTextoPadraoChange = (event) => {
    setTextoPadrao(event.target.value);
    const item = findSelectedItem(codigo);
    if (item) {
      setShowIncidenteField(item.INCIDENTE === "Sim");
      setShowObservacaoField(item.OBS === "Sim");
    }
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
    setSgdData([]);
    setSubmitted(false);
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    const item = findSelectedItem(codigo);
    event.preventDefault();
    setSubmitted(true);
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      if (item) {
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

          // Requisição GET para buscar todos os dados de /netfacilsgd
          const sgdResponse = await axiosInstance.get(`/netfacilsgd`);
          const allSgdData = sgdResponse.data;

          // Filtragem dos dados com base nos IDs do selectedItem.SGD
          const sgdIds = item?.SGD.map(Number) || [];
          const filteredSgdData = allSgdData.filter((item) =>
            sgdIds.includes(item.ID_SGD),
          );

          // Atualizar o estado com os dados filtrados
          setSgdData(filteredSgdData);
        } catch (err) {
          console.error(
            "Erro ao copiar texto para a área de transferência:",
            err,
          );
        }
        document.body.removeChild(textArea);
      }
    }

    setValidated(true);
  };

  const filterData = (conditions) => {
    return data.filter((item) =>
      conditions.every(([field, value]) => item[field] === value),
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
      className="netsmsfacil-container py-5"
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

        <Button variant="dark" onClick={handleCodigoSubmit}>
          <i className="bi bi-check-lg"></i>
        </Button>

        <Button
          variant="outline-dark"
          className="botao-info"
          onClick={abrirTabelaConsulta}
        >
          <i className="bi bi-question-lg"></i>
        </Button>

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
              ),
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
              onChange={removerAcentos}
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
            onChange={removerAcentos}
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
          <Button variant="primary" onClick={handleSubmit}>
            TESTE
          </Button>

          <Button variant="destructive" onClick={handleReset}>
            <i className="bi bi-arrow-clockwise"></i>
          </Button>
        </div>

        <Alert
          variant="success"
          show={showAlert}
          onClose={() => setShowAlert(false)}
          dismissible
        >
          O texto foi copiado para a área de transferência com sucesso.
          {sgdData.length > 0 && (
            <div className="mt-2">
              Fechamentos SGD:
              <Table bordered variant="success" className="mt-3">
                <thead>
                  <tr>
                    <th>Fila</th>
                    <th>Seleção</th>
                    <th>Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {sgdData.map((item) => (
                    <tr key={item.ID_SGD}>
                      <td>{item.FILA}</td>
                      <td>{item.SELECAO}</td>
                      <td>{item.MOTIVO}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
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
