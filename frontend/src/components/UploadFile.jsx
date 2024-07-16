import React, { useState } from "react";

import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import "./UploadFile.css";
import axiosInstance from "../services/axios";

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [newData, setNewData] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Nenhum arquivo selecionado.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axiosInstance.post(`/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNewData(response.data.join("\n"));
      setErrorMessage("");

      const textoResposta = response.data.join("\n");
      const textoCopiado = document.createElement("textarea");
      textoCopiado.value = textoResposta;
      document.body.appendChild(textoCopiado);
      textoCopiado.select();
      try {
        document.execCommand("copy");
      } catch (err) {
        console.error(
          "Erro ao copiar texto para a área de transferência:",
          err
        );
      }
      document.body.removeChild(textoCopiado);
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
      setErrorMessage(
        error.response?.data ||
          "Erro ao enviar o arquivo. Por favor, tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="upload-section" data-bs-theme="dark">
      <Card.Body className="p-4 mx-2">
        <h4 className="mb-5">Envio de Arquivo</h4>
        <Form.Group controlId="fileUpload">
          <Form.Label>Selecione uma extração do QualiNET:</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
            className="mt-2"
          />
        </Form.Group>
        <Button
          variant="outline-light"
          onClick={handleFileUpload}
          className="mt-4 uploadOC"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Enviando...
            </>
          ) : (
            "Enviar"
          )}
        </Button>

        {errorMessage && (
          <Alert dismissible variant="danger" className="mt-4">
            {errorMessage}
          </Alert>
        )}

        {newData && (
          <div className="new-data-section mt-5">
            <Alert dismissible variant="success" className="mt-4">
              O texto foi copiado para a área de transferência com sucesso.
            </Alert>
            <p>
              <strong>Novos Dados:</strong>
            </p>
            <Form.Control as="textarea" rows={5} value={newData} readOnly />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default UploadFile;
