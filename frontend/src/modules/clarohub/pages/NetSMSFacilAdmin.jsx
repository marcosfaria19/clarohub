import React, { useEffect, useMemo, useState } from "react";
import { Button, Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import AddNetSMSFacil from "modules/clarohub/components/AddNetSMSFacil";
import axiosInstance from "services/axios";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";
import Container from "modules/shared/components/ui/container";

function NetSMSFacilAdmin() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    try {
      const response = await axiosInstance.get(`/netsmsfacil`);
      setDados(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do backend:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: "id",
        header: "ID",
        accessorKey: "ID",
      },
      {
        header: "TRATATIVA",
        accessorKey: "TRATATIVA",
      },
      {
        header: "TIPO",
        accessorKey: "TIPO",
      },
      {
        header: "ABERTURA/FECHAMENTO",
        accessorKey: "ABERTURA/FECHAMENTO",
      },
      {
        header: "NETSMS",
        accessorKey: "NETSMS",
      },
      {
        header: "TEXTO PADRÃO",
        accessorKey: "TEXTO PADRAO",
      },
      {
        header: "OBS?",
        accessorKey: "OBS",
      },
      {
        header: "INC?",
        accessorKey: "INCIDENTE",
      },

      {
        header: "AÇÕES",
        accessorKey: "acoes",
      },
    ],
    [],
  );

  return (
    <Container>
      <h2 className="mb-6 select-none text-3xl font-semibold text-foreground sm:mb-8 md:mb-10 lg:mb-12">
        Códigos Cadastrados
      </h2>

      <TabelaPadrao columns={columns} data={dados} />
    </Container>
  );
}

export default NetSMSFacilAdmin;
