import React, { useMemo } from "react";
import useSWR from "swr";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "modules/shared/components/ui/dialog";
import { Button } from "modules/shared/components/ui/button";
import { SWR_KEYS } from "services/swrConfig";

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

  // SWR para buscar dados do SGD
  const { data: allSgdData, isLoading } = useSWR(SWR_KEYS.NETFACIL_SGD);

  // Filtrar dados baseado no item selecionado
  const sgdData = useMemo(() => {
    if (!allSgdData || !item?.SGD) return [];

    const sgdIds = item.SGD.map(Number);
    return allSgdData.filter((dataItem) => sgdIds.includes(dataItem.ID_SGD));
  }, [allSgdData, item]);

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
