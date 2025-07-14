// TasksModule.jsx
import React, { useState, useEffect } from "react";
import useProjects from "modules/claroflow/hooks/useProjects";
import { Button } from "modules/shared/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "modules/shared/components/ui/dropdown-menu";
import { motion } from "framer-motion";

import { Skeleton } from "modules/shared/components/ui/skeleton";
import axiosInstance from "services/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TabelaPadrao } from "modules/shared/components/TabelaPadrao";
import { formatDuration } from "modules/insight/utils/timeDurationUtils";

const TasksModule = () => {
  const { projects, fetchAssignments } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carrega as assignments quando um projeto é selecionado
  useEffect(() => {
    const loadAssignments = async () => {
      if (!selectedProject) {
        setAssignments([]);
        setSelectedAssignment(null);
        return;
      }

      try {
        const assignmentsData = await fetchAssignments(selectedProject);
        setAssignments(assignmentsData);
      } catch (err) {
        console.error("Erro ao carregar assignments:", err);
        setError("Erro ao carregar demandas do projeto");
      }
    };

    loadAssignments();
  }, [selectedProject, fetchAssignments]);

  // Busca as tasks quando uma assignment é selecionada
  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedAssignment) {
        setTasks([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(
          `/flow/tasks/assignment/${selectedAssignment}`,
        );

        // Transforma os dados para formato mais amigável
        const formattedTasks = response.data.map((task) => ({
          ...task,
          history:
            task.history?.length > 0
              ? task.history[task.history.length - 1]
              : null,
        }));

        setTasks(formattedTasks);
      } catch (err) {
        console.error("Erro ao buscar tarefas:", err);
        setError("Erro ao carregar demandas");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedAssignment]);

  // Colunas da tabela
  const columns = [
    {
      accessorKey: "IDDEMANDA",
      header: "ID Demanda",
      enableHiding: false,
    },
    {
      accessorKey: "CIDADE",
      header: "Cidade",
    },
    {
      accessorKey: "status.name",
      header: "Status Atual",
    },
    {
      accessorKey: "history.user.name",
      header: "Último Responsável",
      sorted: true,
      cell: ({ row }) =>
        row.original.history?.user?.name || row.original.assignedTo?.name || "",
    },
    {
      accessorKey: "history.startedAt",
      header: "Início",
      sorted: true,
      cell: ({ row }) =>
        row.original.history?.startedAt
          ? format(
              new Date(row.original.history.startedAt),
              "dd/MM/yyyy HH:mm",
              { locale: ptBR },
            )
          : "",
    },
    {
      accessorKey: "executionTime",
      header: "Tempo de Execução",
      cell: ({ row }) => {
        const { history } = row.original;

        if (!history?.startedAt || !history?.finishedAt) {
          return "";
        }

        const started = new Date(history.startedAt);
        const finished = new Date(history.finishedAt);
        const diffMs = finished - started;

        return formatDuration(diffMs);
      },
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
    >
      <div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Acompanhamento de Demandas
          </h1>
          <p className="text-muted-foreground">
            Visualize as tarefas associadas às demandas dos projetos
            selecionados
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-4 mt-6 flex flex-wrap gap-4">
          {/* Seletor de Projeto */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="flex items-center">
                {selectedProject
                  ? projects.find((p) => p._id === selectedProject)?.name
                  : "Selecione um projeto"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-60 overflow-y-auto">
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project._id}
                  onClick={() => setSelectedProject(project._id)}
                >
                  {project.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Seletor de Demanda */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={!selectedProject}>
              <Button variant="secondary" className="flex items-center">
                {selectedAssignment
                  ? assignments.find((a) => a._id === selectedAssignment)?.name
                  : "Selecione uma demanda"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-60 overflow-y-auto">
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <DropdownMenuItem
                    key={assignment._id}
                    onClick={() => setSelectedAssignment(assignment._id)}
                  >
                    {assignment.name}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  Nenhuma demanda disponível
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tabela */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                {columns.map((_, j) => (
                  <Skeleton key={j} className="h-10 flex-1" />
                ))}
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
            <p className="text-destructive">{error}</p>
          </div>
        ) : selectedAssignment ? (
          <TabelaPadrao
            columns={columns}
            data={tasks}
            isLoading={loading}
            pageSize={10}
            pagination={true}
            filterInput={true}
            columnFilter={false}
          />
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground">
              Selecione um projeto e uma demanda para visualizar as tarefas
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TasksModule;
