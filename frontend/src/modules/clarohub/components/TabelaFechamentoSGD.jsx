import React, { useEffect, useState } from "react";
import axiosInstance from "services/axios";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "modules/shared/components/ui/dialog";
import { Button } from "modules/shared/components/ui/button";

const TabelaFechamentoSGD = ({ item, isOpen, onRequestClose }) => {
  const columns = [
    {
      accessorKey: "FILA",
      header: "Fila",
    },
    {
      accessorKey: "SELECAO",
      header: "Seleção",
    },
    {
      accessorKey: "MOTIVO",
      header: "Motivo",
    },
  ];

  const [sgdData, setSgdData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const sgdResponse = await axiosInstance.get(`/netfacilsgd`);
        const allSgdData = sgdResponse.data;

        const sgdIds = item?.SGD.map(Number) || [];
        const filteredSgdData = allSgdData.filter((dataItem) =>
          sgdIds.includes(dataItem.ID_SGD),
        );

        setSgdData(filteredSgdData);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (item && item.SGD) {
      fetchData();
    }
  }, [item]);

  return (
    <Dialog open={isOpen} onOpenChange={onRequestClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Fechamentos Sugeridos no SGD</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex h-[60vh] items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : sgdData.length > 0 ? (
          <div className="custom-scrollbar max-h-[60vh] overflow-auto pb-10">
            <TabelaPadrao
              columns={columns}
              data={sgdData}
              filterInput={false}
              columnFilter={false}
              pagination={false}
            />
          </div>
        ) : null}
        <DialogFooter>
          <Button variant="secondary" onClick={onRequestClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TabelaFechamentoSGD;
