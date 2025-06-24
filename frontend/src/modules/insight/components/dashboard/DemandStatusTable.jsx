import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DemandStatusTable = React.memo(({ data = [], className = "" }) => {
  // Estado para ordenação
  const [sortConfig, setSortConfig] = useState(null);

  // Estado para filtro de status
  const [statusFilter, setStatusFilter] = useState(null);

  // Função para ordenar a tabela
  const handleSort = useCallback(
    (key) => {
      let direction = "ascending";

      if (
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === "ascending"
      ) {
        direction = "descending";
      }

      setSortConfig({ key, direction });
    },
    [sortConfig],
  );

  // Função para filtrar por status
  const handleStatusFilter = useCallback((status) => {
    setStatusFilter(status);
  }, []);

  // Dados ordenados e filtrados
  const sortedData = useMemo(() => {
    // Primeiro aplicar o filtro
    let filteredData = [...data];
    if (statusFilter) {
      filteredData = filteredData.filter(
        (item) => item.status === statusFilter,
      );
    }

    // Depois aplicar a ordenação
    if (sortConfig) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  }, [data, sortConfig, statusFilter]);

  // Função para renderizar o ícone de ordenação
  const renderSortIcon = useCallback(
    (key) => {
      if (!sortConfig || sortConfig.key !== key) {
        return (
          <svg
            className="h-4 w-4 opacity-30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        );
      }

      return sortConfig.direction === "ascending" ? (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      );
    },
    [sortConfig],
  );

  // Função para renderizar a cor do status
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "Em Fila":
        return "bg-info text-info-foreground";
      case "Em Progresso":
        return "bg-warning text-warning-foreground";
      case "Finalizada":
        return "bg-success text-success-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  }, []);

  // Função para renderizar a cor da prioridade
  const getPriorityColor = useCallback((prioridade) => {
    switch (prioridade) {
      case "Crítica":
        return "bg-destructive text-destructive-foreground";
      case "Alta":
        return "bg-warning text-warning-foreground";
      case "Média":
        return "bg-info text-info-foreground";
      case "Baixa":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  }, []);

  // Função para calcular a cor da barra de progresso
  const getProgressColor = useCallback((progresso) => {
    if (progresso < 25) return "bg-destructive";
    if (progresso < 50) return "bg-warning";
    if (progresso < 75) return "bg-info";
    return "bg-success";
  }, []);

  // Função para formatar data
  const formatDate = useCallback((dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR");
    } catch {
      return "Data inválida";
    }
  }, []);

  if (!data || data.length === 0) {
    return (
      <motion.div
        className={`rounded-lg bg-card p-5 shadow-md ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h3 className="mb-4 text-lg font-medium text-foreground">
          Status das Demandas
        </h3>
        <div className="flex h-40 items-center justify-center">
          <p className="text-muted-foreground">Nenhuma demanda encontrada</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`rounded-lg bg-card p-5 shadow-md ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="mb-4 flex flex-col items-start justify-between md:flex-row md:items-center">
        <h3 className="text-lg font-medium text-foreground">
          Status das Demandas
        </h3>

        <div className="mt-2 flex space-x-2 md:mt-0">
          <button
            className={`rounded-md px-3 py-1 text-xs transition-colors ${
              statusFilter === null
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
            onClick={() => handleStatusFilter(null)}
          >
            Todas
          </button>
          <button
            className={`rounded-md px-3 py-1 text-xs transition-colors ${
              statusFilter === "Em Fila"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
            onClick={() => handleStatusFilter("Em Fila")}
          >
            Em Fila
          </button>
          <button
            className={`rounded-md px-3 py-1 text-xs transition-colors ${
              statusFilter === "Em Progresso"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
            onClick={() => handleStatusFilter("Em Progresso")}
          >
            Em Progresso
          </button>
          <button
            className={`rounded-md px-3 py-1 text-xs transition-colors ${
              statusFilter === "Finalizada"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
            onClick={() => handleStatusFilter("Finalizada")}
          >
            Finalizada
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th
                className="cursor-pointer p-3 text-left text-sm font-medium text-muted-foreground"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  {renderSortIcon("id")}
                </div>
              </th>
              <th
                className="cursor-pointer p-3 text-left text-sm font-medium text-muted-foreground"
                onClick={() => handleSort("titulo")}
              >
                <div className="flex items-center space-x-1">
                  <span>Título</span>
                  {renderSortIcon("titulo")}
                </div>
              </th>
              <th
                className="cursor-pointer p-3 text-left text-sm font-medium text-muted-foreground"
                onClick={() => handleSort("responsavel")}
              >
                <div className="flex items-center space-x-1">
                  <span>Responsável</span>
                  {renderSortIcon("responsavel")}
                </div>
              </th>
              <th
                className="cursor-pointer p-3 text-left text-sm font-medium text-muted-foreground"
                onClick={() => handleSort("prioridade")}
              >
                <div className="flex items-center space-x-1">
                  <span>Prioridade</span>
                  {renderSortIcon("prioridade")}
                </div>
              </th>
              <th
                className="cursor-pointer p-3 text-left text-sm font-medium text-muted-foreground"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {renderSortIcon("status")}
                </div>
              </th>
              <th
                className="cursor-pointer p-3 text-left text-sm font-medium text-muted-foreground"
                onClick={() => handleSort("prazo")}
              >
                <div className="flex items-center space-x-1">
                  <span>Prazo</span>
                  {renderSortIcon("prazo")}
                </div>
              </th>
              <th
                className="cursor-pointer p-3 text-left text-sm font-medium text-muted-foreground"
                onClick={() => handleSort("progresso")}
              >
                <div className="flex items-center space-x-1">
                  <span>Progresso</span>
                  {renderSortIcon("progresso")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {sortedData.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="border-b border-border hover:bg-secondary/10"
                >
                  <td className="p-3 text-sm text-foreground">{item.id}</td>
                  <td className="p-3 text-sm font-medium text-foreground">
                    {item.titulo}
                  </td>
                  <td className="p-3 text-sm text-foreground">
                    {item.responsavel}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block rounded-md px-2 py-1 text-xs ${getPriorityColor(item.prioridade)}`}
                    >
                      {item.prioridade}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block rounded-md px-2 py-1 text-xs ${getStatusColor(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-foreground">
                    {formatDate(item.prazo)}
                  </td>
                  <td className="p-3">
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <motion.div
                        className={`h-2 rounded-full ${getProgressColor(item.progresso)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progresso}%` }}
                        transition={{
                          duration: 0.5,
                          delay: 0.1 + index * 0.05,
                        }}
                      />
                    </div>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {item.progresso}%
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>

            {sortedData.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-4 text-center text-muted-foreground"
                >
                  Nenhuma demanda encontrada com os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
});

DemandStatusTable.displayName = "DemandStatusTable";

export default DemandStatusTable;
