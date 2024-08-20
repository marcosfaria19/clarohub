// NetSMSFacil.js
import React, { useState, useEffect } from "react";
import "./NetSMSFacil.css";
import TabelaNetFacil from "../components/TabelaNetFacil";
import axiosInstance from "../../../services/axios";

import Input from "../../shared/components/Input";
import { BsArrowClockwise, BsCheck, BsCopy, BsQuestion } from "react-icons/bs";
import Select from "../../shared/components/Select";
import { Button } from "../../shared/components/ui/button";

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
        item["TEXTO PADRAO"] === event.target.value.split(" - ")[1],
    );
    setShowIncidenteField(
      selectedItem ? selectedItem.INCIDENTE === "Sim" : false,
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
          item["TEXTO PADRAO"] === textoPadrao.split(" - ")[1],
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
          err,
        );
      }
      document.body.removeChild(textArea);
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
    <container className="bg-bgWhite flex w-full flex-col px-72 py-12">
      <div className="codigo-container">
        <Input
          type="text"
          placeholder="Cód."
          value={codigo}
          maxLength={3}
          onChange={handleCodigoChange}
          className={`${submitted && !codigo ? "border-red-500" : ""}`}
        />

        <div className="group relative">
          <Button variant="primary" onClick={handleCodigoSubmit}>
            <BsCheck />
          </Button>
          <div className="absolute left-0 top-full mt-2 hidden w-max rounded bg-gray-700 p-2 text-xs text-white group-hover:block">
            Encontrar automaticamente
          </div>
        </div>

        <div className="group relative">
          <Button
            variant="outline-dark"
            className="botao-info"
            onClick={abrirTabelaConsulta}
          >
            <BsQuestion />
          </Button>
          <div className="absolute left-0 top-full mt-2 hidden w-max rounded bg-gray-700 p-2 text-xs text-white group-hover:block">
            Exibir a lista de códigos
          </div>
        </div>

        <TabelaNetFacil
          isOpen={tabelaConsulta}
          onRequestClose={fecharTabelaConsulta}
        />
      </div>

      <form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="form-group-spacing">
          <label
            htmlFor="tratativa"
            className="block text-sm font-medium text-gray-700"
          >
            Tratativa
          </label>
          <Select
            id="tratativa"
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
          </Select>
          <div className="mt-1 text-sm text-red-500">
            Por favor, selecione uma tratativa.
          </div>
        </div>

        <div className="form-group-spacing">
          <label
            htmlFor="tipo"
            className="block text-sm font-medium text-gray-700"
          >
            Tipo
          </label>
          <Select
            id="tipo"
            value={tipo}
            onChange={handleTipoChange}
            disabled={!tratativa}
            required
            className="form-select"
          >
            <option value="">Selecione</option>
            {getUniqueValues("TIPO", [["TRATATIVA", tratativa]]).map(
              (value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ),
            )}
          </Select>
          <div className="mt-1 text-sm text-red-500">
            Por favor, selecione um tipo.
          </div>
        </div>

        <div className="form-group-spacing">
          <label
            htmlFor="aberturaFechamento"
            className="block text-sm font-medium text-gray-700"
          >
            Abertura/Fechamento
          </label>
          <Select
            id="aberturaFechamento"
            value={aberturaFechamento}
            onChange={handleAberturaFechamentoChange}
            disabled={!tipo}
            required
            className="form-select"
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
          </Select>
          <div className="mt-1 text-sm text-red-500">
            Por favor, selecione abertura ou fechamento.
          </div>
        </div>

        <div className="form-group-spacing">
          <label
            htmlFor="netsms"
            className="block text-sm font-medium text-gray-700"
          >
            NetSMS
          </label>
          <Select
            id="netsms"
            value={netsms}
            onChange={handleNetsmsChange}
            disabled={!aberturaFechamento}
            required
            className="form-select"
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
          </Select>
          <div className="mt-1 text-sm text-red-500">
            Por favor, selecione um NetSMS.
          </div>
        </div>

        <div className="form-group-spacing">
          <label
            htmlFor="textoPadrao"
            className="block text-sm font-medium text-gray-700"
          >
            Texto Padrão
          </label>
          <Select
            id="textoPadrao"
            value={textoPadrao}
            onChange={handleTextoPadraoChange}
            disabled={!netsms}
            required
            className="form-select"
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
          </Select>
          <div className="mt-1 text-sm text-red-500">
            Por favor, selecione um texto padrão.
          </div>
        </div>

        {showIncidenteField && (
          <div className="form-group-spacing">
            <label
              htmlFor="incidente"
              className="block text-sm font-medium text-gray-700"
            >
              Incidente
            </label>
            <input
              type="text"
              id="incidente"
              value={incidente}
              onChange={handleIncidenteChange}
              required
              placeholder="Por favor insira um incidente"
              className="form-input"
            />
            <div className="mt-1 text-sm text-red-500">
              Por favor, preencha o campo de incidente.
            </div>
          </div>
        )}

        <div className="form-group-spacing">
          <label
            htmlFor="observacao"
            className="block text-sm font-medium text-gray-700"
          >
            Observação
          </label>
          <input
            type="text"
            id="observacao"
            value={observacao}
            onChange={handleObservacaoChange}
            required={showObservacaoField}
            placeholder={
              showObservacaoField ? "Por favor insira uma observação" : ""
            }
            className="form-input"
          />
          <div className="mt-1 text-sm text-red-500">
            {showObservacaoField
              ? "Por favor, preencha o campo de observação."
              : "Por favor, preencha o campo de observação."}
          </div>
        </div>

        <div className="mb-3 flex space-x-4">
          <div className="group relative">
            <Button variant="success" className="botao-gerar" type="submit">
              <BsCopy />
            </Button>
            <div className="absolute left-0 top-full mt-2 hidden w-max rounded bg-gray-700 p-2 text-xs text-white group-hover:block">
              Gerar texto padrão
            </div>
          </div>

          <div className="group relative">
            <Button variant="error" onClick={handleReset}>
              <BsArrowClockwise />
            </Button>
            <div className="absolute left-0 top-full mt-2 hidden w-max rounded bg-gray-700 p-2 text-xs text-white group-hover:block">
              Reiniciar
            </div>
          </div>
        </div>

        {showAlert && (
          <div
            className="relative rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
            role="alert"
          >
            O texto foi copiado para a área de transferência com sucesso.
            <span
              className="absolute bottom-0 right-0 top-0 px-4 py-3"
              onClick={() => setShowAlert(false)}
            >
              <svg
                className="h-6 w-6 fill-current text-green-500"
                role="button"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 5.652a.5.5 0 1 1 .707.707L10.707 10l4.348 4.348a.5.5 0 0 1-.707.707L10 10.707l-4.348 4.348a.5.5 0 1 1-.707-.707L9.293 10 4.946 5.652a.5.5 0 1 1 .707-.707L10 9.293l4.348-4.348z" />
              </svg>
            </span>
          </div>
        )}

        {concatenatedText && (
          <div className="mt-5">
            <p className="font-bold">Texto Padrão:</p>
            <textarea
              rows={5}
              value={concatenatedText}
              readOnly
              className="form-textarea mt-1 block w-full"
            />
          </div>
        )}
      </form>
    </container>
  );
};

export default NetSMSFacil;
