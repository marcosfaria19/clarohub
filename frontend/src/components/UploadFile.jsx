import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [newData, setNewData] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

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
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
    }
  };

  return (
    <div>
      <Form.Group controlId="fileUpload">
        <Form.Label>Selecione um arquivo:</Form.Label>
        <Form.Control
          type="file"
          onChange={handleFileChange}
          className="mt-2"
        />
      </Form.Group>
      <Button variant="dark" onClick={handleFileUpload} className="mt-3">
        Enviar
      </Button>

      {newData && (
        <div className="mt-5">
          <p>
            <strong>Novos Dados:</strong>
          </p>
          <Form.Control as="textarea" rows={5} value={newData} readOnly />
        </div>
      )}
    </div>
  );
};

export default UploadFile;
