// TabelaNetFacil.js
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import TabelaPadrao from "./TabelaPadrao";
import "./TabelaNetFacil.css";
import axiosInstance from "../../../services/axios";

const TabelaNetFacil = ({ isOpen, onRequestClose }) => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "ID",
      },
      {
        Header: "TRATATIVA",
        accessor: "TRATATIVA",
      },
      {
        Header: "TIPO",
        accessor: "TIPO",
      },
      {
        Header: "ABERTURA/FECHAMENTO",
        accessor: "ABERTURA/FECHAMENTO",
      },
      {
        Header: "NETSMS",
        accessor: "NETSMS",
      },
      {
        Header: "TEXTO PADRÃO",
        accessor: "TEXTO PADRAO",
      },
    ],
    []
  );

  const handleDownload = () => {
    axiosInstance({
      url: "/netsmsfacil/download",
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "netsmsfacil.csv");
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => console.error("Error downloading the file:", error));
  };

  useEffect(() => {
    if (isOpen) {
      axiosInstance
        .get("/netsmsfacil")
        .then((response) => setData(response.data))
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [isOpen]);

  return (
    <Modal show={isOpen} onHide={onRequestClose} dialogClassName="modal-custom">
      <div>
        <Modal.Header closeButton>
          <Modal.Title>Códigos Cadastrados</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TabelaPadrao
            columns={columns}
            data={data}
            filter={filter}
            setFilter={setFilter}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleDownload}>
            <i className="bi bi-download"></i> Download
          </Button>
          <Button variant="secondary" onClick={onRequestClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default TabelaNetFacil;
