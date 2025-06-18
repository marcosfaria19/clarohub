import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";
import useManagerTable from "modules/clarospark/hooks/useManagerTable";
import { formatUserName } from "modules/shared/utils/formatUsername";
import StatusChanger from "./StatusChanger";

function ManagerTable() {
  const {
    dados,

    fetchDados,
    changeStatus,
  } = useManagerTable();

  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchDados();
      initialFetchDone.current = true;
    }
  }, [fetchDados]);

  const handleStatusChange = useCallback(
    (item, { newStatus, reason }) => {
      changeStatus(item, newStatus, reason);
    },
    [changeStatus],
  );

  const columns = useMemo(() => {
    const renderStatusChanger = (row) => (
      <StatusChanger
        currentStatus={row.original.status}
        disabled={row.original.status === "Aprovada"}
        onChange={({ newStatus, reason }) =>
          handleStatusChange(row.original, { newStatus, reason })
        }
        showReason={true}
      />
    );

    const renderTextTruncated = (text, title) => (
      <div className="max-w-[200px] truncate" title={title || text}>
        {text}
      </div>
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
    </div>
  );
}

export default ManagerTable;
