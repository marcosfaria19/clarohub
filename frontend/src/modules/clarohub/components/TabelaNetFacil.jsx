import React, { useEffect, useState } from "react";
import { Button } from "modules/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "modules/shared/components/ui/dialog";

import { Download } from "lucide-react";
import axiosInstance from "services/axios";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";

const TabelaNetFacil = ({ isOpen, onRequestClose }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    { header: "ID", accessorKey: "ID" },
    { header: "TRATATIVA", accessorKey: "TRATATIVA" },
    { header: "TIPO", accessorKey: "TIPO" },
    { header: "ABERTURA/FECHAMENTO", accessorKey: "ABERTURA/FECHAMENTO" },
    { header: "NETSMS", accessorKey: "NETSMS" },
    { header: "TEXTO PADRÃO", accessorKey: "TEXTO PADRAO" },
  ];

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
      setIsLoading(true);
      axiosInstance
        .get("/netsmsfacil")
        .then((response) => {
          setData(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onRequestClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Códigos Cadastrados</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-[60vh] items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="scrollbar-spark max-h-[60vh] overflow-auto p-2 pr-5">
            <TabelaPadrao columns={columns} data={data} />
          </div>
        )}

        <DialogFooter>
          <Button variant="primary" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="secondary" onClick={onRequestClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TabelaNetFacil;
