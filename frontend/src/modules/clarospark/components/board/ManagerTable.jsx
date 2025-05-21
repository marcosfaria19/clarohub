import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "modules/shared/components/ui/dialog";
import { Button } from "modules/shared/components/ui/button";
import useManagerTable from "modules/clarospark/hooks/useManagerTable";
import formatUserName from "modules/shared/utils/formatUsername";
import StatusChanger from "./StatusChanger";

function ManagerTable() {
  const {
    dados,
    isConfirmOpen,
    newStatus,
    fetchDados,
    updateStatus,
    setIsConfirmOpen,
    setSelectedItem,
    setNewStatus,
  } = useManagerTable();

  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchDados();
      initialFetchDone.current = true;
    }
  }, [fetchDados]);

  const handleStatusChange = useCallback(
    (item, status) => {
      setSelectedItem(item);
      setNewStatus(status);
      setIsConfirmOpen(true);
    },
    [setSelectedItem, setNewStatus, setIsConfirmOpen],
  );

  const renderTextTruncated = (text, title) => (
    <div className="max-w-[200px] truncate" title={title || text}>
      {text}
    </div>
  );

  const columns = useMemo(() => {
    const renderStatusChanger = (row) => (
      <StatusChanger
        currentStatus={row.original.status}
        disabled={row.original.status === "Aprovada"}
        onChange={(newStatus) => handleStatusChange(row.original, newStatus)}
      />
    );

    return [
      {
        header: "Colaborador",
        accessorKey: "creator.name",
        sorted: true,
        cell: ({ row }) =>
          renderTextTruncated(formatUserName(row.original.creator.name)),
      },
      {
        header: "Título",
        accessorKey: "title",
      },
      {
        header: "Descrição",
        accessorKey: "description",
        cell: ({ row }) => renderTextTruncated(row.original.description),
      },
      {
        header: "Setor",
        accessorKey: "subject",
        sorted: true,
      },
      {
        header: "Likes",
        accessorKey: "likesCount",
        sorted: true,
      },
      {
        header: "Criada em",
        accessorKey: "createdAt",
        sorted: true,
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt);
          return date.toLocaleDateString("pt-BR");
        },
      },
      {
        header: "Tratada Por",
        accessorKey: "lastChangedBy",
        sorted: true,
        cell: ({ row }) => {
          const lastChange = row.original.history?.at(-1);
          return renderTextTruncated(
            lastChange ? formatUserName(lastChange.changedBy) : "",
          );
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        sorted: true,
        cell: ({ row }) => renderStatusChanger(row),
      },
    ];
  }, [handleStatusChange]);

  return (
    <div className="relative top-[-50px] px-12">
      <TabelaPadrao columnFilter={false} columns={columns} data={dados} />
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-5">
              Confirmar alteração de status
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja alterar o status para {newStatus}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={updateStatus}>Confirmar</Button>
            <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ManagerTable;
