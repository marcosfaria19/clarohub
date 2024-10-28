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
import { Button } from "modules/shared/components/ui/button";

function ManagerTable() {
  const [dados, setDados] = useState([]);

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

  const updateStatus = async (id, newStatus) => {
    try {
      await axiosInstance.patch(`/storm/ideas/${id}`, { status: newStatus });
      setDados((prevDados) =>
        prevDados.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item,
        ),
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const columns = useMemo(
    () => [
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
        header: "Status",
        accessorKey: "status",
        sorted: true,
        cell: ({ row }) => {
          const status = row.original.status;
          const { color, icon } = statusConfig[status] || {};

          return (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={`${color} px-2 text-sm`}>
                  {icon} {status}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                {Object.keys(statusConfig).map((statusKey) => (
                  <DropdownMenuItem
                    key={statusKey}
                    onClick={() => updateStatus(row.original._id, statusKey)}
                  >
                    {statusConfig[statusKey].icon} {statusKey}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="px-12">
      <TabelaPadrao
        columns={columns}
        data={dados}
        onDelete={() => {}}
        onEdit={() => {}}
      />
    </div>
  );
}

export default ManagerTable;
