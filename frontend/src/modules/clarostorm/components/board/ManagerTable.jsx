import React, { useEffect, useMemo, useState } from "react";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";
import axiosInstance from "services/axios";
import statusConfig from "modules/clarostorm/utils/statusConfig";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "modules/shared/components/ui/dropdown-menu";
import { Badge } from "modules/shared/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "modules/shared/components/ui/dialog";
import { Button } from "modules/shared/components/ui/button";

function ManagerTable() {
  const [dados, setDados] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    try {
      const response = await axiosInstance.get(`/storm/ideas`);
      setDados(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do backend:", error);
    }
  };

  const updateStatus = async () => {
    if (!selectedItem || !newStatus) return;

    try {
      await axiosInstance.patch(`/storm/ideas/${selectedItem._id}`, {
        status: newStatus,
      });
      setDados((prevDados) =>
        prevDados.map((item) =>
          item._id === selectedItem._id ? { ...item, status: newStatus } : item,
        ),
      );
      setIsConfirmOpen(false);
      setSelectedItem(null);
      setNewStatus("");
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleStatusChange = (item, status) => {
    setSelectedItem(item);
    setNewStatus(status);
    setIsConfirmOpen(true);
  };

  const columns = useMemo(() => {
    const statusDisplayMap = {
      Aprovar: "Aprovada",
      Arquivar: "Arquivada",
    };
    return [
      {
        header: "Colaborador",
        accessorKey: "creator.name",
        sorted: true,
      },
      {
        header: "Título",
        accessorKey: "title",
      },
      {
        header: "Descrição",
        accessorKey: "description",
        cell: ({ row }) => (
          <div className="max-w-lg truncate" title={row.original.description}>
            {row.original.description}
          </div>
        ),
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
        header: "Status",
        accessorKey: "status",
        sorted: true,
        cell: ({ row }) => {
          const status = row.original.status;
          const { color } = statusConfig[status] || {};

          return (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger disabled={status !== "Em Análise"}>
                <Badge
                  variant="outline"
                  className={`${color} min-w-20 border-0`}
                >
                  {status}
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(statusDisplayMap).map((displayText) => (
                  <DropdownMenuItem
                    key={displayText}
                    onClick={() =>
                      handleStatusChange(
                        row.original,
                        statusDisplayMap[displayText],
                      )
                    }
                  >
                    {displayText}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];
  }, []);

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
