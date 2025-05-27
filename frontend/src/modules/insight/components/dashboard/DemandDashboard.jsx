import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import KPICard from "./KPICard";
import TeamPerformanceChart from "./TeamPerformanceChart";
import TeamHeatmap from "./TeamHeatmap";
import PerformanceRadarChart from "./PerformanceRadarChart";
import DemandStatusTable from "./DemandStatusTable";
import useProjects from "modules/claroflow/hooks/useProjects";
import { useUsers } from "modules/claroflow/hooks/useUsers";
import useKPI from "modules/insight/hooks/useKPI";

import { ChevronDown, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "modules/shared/components/ui/dropdown-menu";
import { formatUserName } from "modules/shared/utils/formatUsername";

const DemandDashboard = () => {
  // Estados de filtro gerenciados localmente
  const [period, setPeriod] = useState("day");
  const [teamMember, setTeamMember] = useState(null);

  // Estados para seleção de projeto e demanda (assignment)
  const [selectedProject, setSelectedProject] = useState();
  const [selectedAssignment, setSelectedAssignment] = useState();
  const [assignments, setAssignments] = useState([]);

  // Estado para controlar a exibição dos seletores
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [showAssignmentSelector, setShowAssignmentSelector] = useState(false);

  // Estado para controlar a exibição de erros com delay
  const [showError, setShowError] = useState(false);
  const errorTimeoutRef = useRef(null);

  // Estado para controlar se é um recarregamento ou carregamento inicial
  const [isRefetching, setIsRefetching] = useState(false);

  // Obtendo projetos usando o hook useProjects
  const {
    projects,
    fetchAssignments,
    loading: projectsLoading,
  } = useProjects();

  // Obtendo usuários usando o hook useUsers
  const { users } = useUsers(selectedAssignment);

  // Obtendo dados de KPI usando o hook useKPI
  // Passando os parâmetros de filtro diretamente para o hook
  const {
    queueTimeData,
    volumeData,
    teamPerformanceData,
    teamHeatmapData,
    radarData,
    loading: kpiLoading,
    error: kpiError,
    refetch: refreshKPIData,
  } = useKPI({
    projectId: selectedProject,
    assignmentId: selectedAssignment,
    period,
    userId: teamMember ? users.find((u) => u.name === teamMember)?.id : null,
  });

  // Preparando os dados de KPI para exibição
  const kpiData = [queueTimeData, volumeData].filter(Boolean);

  // Lista de membros da equipe para o seletor
  const teamMembers = users.map((user) => ({
    id: user.id,
    name: formatUserName(user.NOME),
  }));

  // Efeito para carregar assignments quando o projeto é selecionado
  useEffect(() => {
    const loadAssignments = async () => {
      if (!selectedProject) {
        setAssignments([]);
        setSelectedAssignment(undefined);
        return;
      }
      const assignmentsData = await fetchAssignments(selectedProject);
      const filteredAssignments = assignmentsData.filter(
        (assignment) => assignment.name !== "Finalizado",
      );

      setAssignments(filteredAssignments);
    };
    loadAssignments();
  }, [selectedProject, fetchAssignments]);

  // Efeito para gerenciar a exibição de erros com delay
  useEffect(() => {
    // Limpa o timeout anterior se existir
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }

    // Se houver um erro, configura um timeout para mostrar após 300ms
    // Isso evita o "flashing" para requisições rápidas (<100ms)
    if (kpiError) {
      errorTimeoutRef.current = setTimeout(() => {
        setShowError(true);
      }, 300);
    } else {
      setShowError(false);
    }

    // Limpa o timeout quando o componente é desmontado
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [kpiError]);

  // Função para alternar o período
  const handlePeriodChange = useCallback(
    (newPeriod) => {
      setPeriod(newPeriod);
      setIsRefetching(true);
      refreshKPIData().finally(() => {
        setIsRefetching(false);
      });
    },
    [setPeriod, refreshKPIData],
  );

  // Função para selecionar um colaborador
  const handleTeamMemberSelect = useCallback(
    (member) => {
      setTeamMember(member);
      setShowTeamSelector(false);
      setIsRefetching(true);
      refreshKPIData().finally(() => {
        setIsRefetching(false);
      });
    },
    [setTeamMember, refreshKPIData],
  );

  // Função para atualizar os dados manualmente
  const handleRefresh = useCallback(() => {
    setIsRefetching(true);
    refreshKPIData().finally(() => {
      setIsRefetching(false);
    });
  }, [refreshKPIData]);

  // Estado de loading combinado
  const isLoading = projectsLoading || (kpiLoading && !isRefetching);

  // Renderizar mensagem de erro (se houver)
  if (showError && kpiError && selectedProject && selectedAssignment) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="rounded-lg bg-card p-6 shadow-md"
      >
        <div className="mb-4 flex items-center text-destructive">
          <AlertCircle className="mr-2 h-6 w-6" />
          <h3 className="text-lg font-medium">Erro ao carregar dados</h3>
        </div>
        <p className="mb-4 text-muted-foreground">
          Ocorreu um erro ao carregar os dados do dashboard.
        </p>
        <Button variant="default" onClick={handleRefresh}>
          Tentar novamente
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
    >
      {/* Cabeçalho do Dashboard */}
      <div className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Dashboard de Demanda/Equipe
          </h1>
          <p className="text-muted-foreground">
            Visão geral de desempenho e status das demandas
          </p>
        </div>

        <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 md:mt-0">
          {/* Seletor de projeto */}
          <DropdownMenu
            open={showProjectSelector}
            onOpenChange={setShowProjectSelector}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="flex items-center"
                disabled={projectsLoading}
              >
                {projects.find((p) => p._id === selectedProject)?.name ||
                  "Selecione um projeto"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project._id}
                  onClick={() => {
                    setSelectedProject(project._id);
                    setSelectedAssignment(undefined);
                    setShowProjectSelector(false);
                  }}
                >
                  {project.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Seletor de demanda */}
          <DropdownMenu
            open={showAssignmentSelector}
            onOpenChange={setShowAssignmentSelector}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="flex items-center"
                disabled={!selectedProject || assignments.length === 0}
              >
                {assignments.find((a) => a._id === selectedAssignment)?.name ||
                  "Selecione uma demanda"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <DropdownMenuItem
                    key={assignment._id}
                    onClick={() => {
                      setSelectedAssignment(assignment._id);
                      setShowAssignmentSelector(false);
                    }}
                  >
                    {assignment.name}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-muted-foreground" />
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Seletor de período */}
          <div className="flex overflow-hidden rounded-md">
            <Button
              variant={period === "day" ? "default" : "secondary"}
              className="px-3 py-2 text-sm font-medium"
              onClick={() => handlePeriodChange("day")}
            >
              Dia
            </Button>
            <Button
              variant={period === "week" ? "default" : "secondary"}
              className="px-3 py-2 text-sm font-medium"
              onClick={() => handlePeriodChange("week")}
            >
              Semana
            </Button>
            <Button
              variant={period === "month" ? "default" : "secondary"}
              className="px-3 py-2 text-sm font-medium"
              onClick={() => handlePeriodChange("month")}
            >
              Mês
            </Button>
          </div>

          {/* Seletor de colaborador */}
          <DropdownMenu
            open={showTeamSelector}
            onOpenChange={setShowTeamSelector}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="flex items-center"
                disabled={
                  !selectedProject ||
                  assignments.length === 0 ||
                  !selectedAssignment
                }
              >
                {teamMember || "Todos os colaboradores"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={() => handleTeamMemberSelect(null)}>
                Todos os colaboradores
              </DropdownMenuItem>
              {teamMembers &&
                teamMembers.map((member) => (
                  <DropdownMenuItem
                    key={member._id}
                    onClick={() => handleTeamMemberSelect(member.name)}
                  >
                    {member.name}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Botão de atualização */}
          <Button
            variant="secondary"
            className="flex items-center"
            onClick={handleRefresh}
            disabled={isRefetching}
          >
            {isRefetching ? (
              <>
                <Loader2 className="-ml-1 mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Overlay de carregamento - apenas para carregamento inicial, não para refetching */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/50"
          >
            <div className="flex items-center rounded-lg bg-card p-6 shadow-lg">
              <Loader2 className="mr-3 h-6 w-6 animate-spin text-primary" />
              <span className="text-foreground">Carregando dados...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de recarregamento - apenas para refetching, mais sutil */}
      <AnimatePresence>
        {isRefetching && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed right-4 top-4 z-50 flex items-center rounded-lg bg-card px-4 py-2 shadow-lg"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
            <span className="text-sm text-foreground">Atualizando...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensagem para selecionar projeto e demanda */}
      {!selectedProject || !selectedAssignment ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border p-6"
        >
          <div className="text-center">
            <h3 className="mb-2 text-lg font-medium text-foreground">
              Selecione um projeto e uma demanda
            </h3>
            <p className="text-muted-foreground">
              Para visualizar os dados do dashboard, selecione um projeto e uma
              demanda nos seletores acima.
            </p>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedProject}-${selectedAssignment}-${period}-${teamMember}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Cards de KPI */}
            {kpiData && (
              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                {kpiData.map((kpi, index) => (
                  <KPICard key={index} {...kpi} />
                ))}
              </div>
            )}

            {/* Gráficos */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {teamPerformanceData && (
                <TeamPerformanceChart data={teamPerformanceData} />
              )}
              {teamHeatmapData && (
                <TeamHeatmap data={teamHeatmapData} loading={kpiLoading} />
              )}
            </div>

            {/* Gráfico de Radar e Tabela */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {radarData && (
                <PerformanceRadarChart
                  data={radarData}
                  colaborador={teamMember || "Colaborador"}
                  loading={kpiLoading}
                />
              )}
              {/* Criando dados fictícios para a tabela de status */}
              <DemandStatusTable
                data={[
                  {
                    id: "DEM-001",
                    titulo: "Implementação de Login",
                    responsavel: "Ana Silva",
                    prioridade: "Alta",
                    status: "Em Progresso",
                    prazo: new Date(2025, 5, 30).toISOString(),
                    progresso: 75,
                  },
                  {
                    id: "DEM-002",
                    titulo: "Correção de Bugs",
                    responsavel: "Carlos Oliveira",
                    prioridade: "Crítica",
                    status: "Em Fila",
                    prazo: new Date(2025, 5, 25).toISOString(),
                    progresso: 10,
                  },
                  {
                    id: "DEM-003",
                    titulo: "Otimização de Banco de Dados",
                    responsavel: "Mariana Costa",
                    prioridade: "Média",
                    status: "Finalizada",
                    prazo: new Date(2025, 5, 15).toISOString(),
                    progresso: 100,
                  },
                  {
                    id: "DEM-004",
                    titulo: "Implementação de Dashboard",
                    responsavel: "Pedro Santos",
                    prioridade: "Alta",
                    status: "Em Progresso",
                    prazo: new Date(2025, 6, 10).toISOString(),
                    progresso: 45,
                  },
                ]}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default React.memo(DemandDashboard);
