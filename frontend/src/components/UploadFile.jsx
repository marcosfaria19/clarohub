import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Card, Alert } from "react-bootstrap"; // Import Alert para mensagens de erro
import "./UploadFile.css";

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [newData, setNewData] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensagens de erro

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Nenhum arquivo selecionado.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Receber os novos dados concatenados após o upload do arquivo
      setNewData(response.data.join("\n"));
      setErrorMessage(""); // Limpa a mensagem de erro se o upload for bem-sucedido
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
      setErrorMessage(
        error.response?.data ||
          "Erro ao enviar o arquivo. Por favor, tente novamente."
      );
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
          className="mt-4"
        >
          Enviar
        </Button>

        {errorMessage && (
          <Alert dismissible variant="danger" className="mt-4">
            {errorMessage}
          </Alert>
        )}

        {newData && (
          <div className="new-data-section mt-5">
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
