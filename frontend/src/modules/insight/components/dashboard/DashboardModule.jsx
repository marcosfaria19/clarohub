import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import KPICard from "./KPICard";
import TeamPerformanceChart from "./TeamPerformanceChart";
import TeamHeatmap from "./TeamHeatmap";
import PerformanceRadarChart from "./PerformanceRadarChart";
import DemandStatusTable from "./DemandStatusTable";
import LoadingFallback from "./LoadingFallback";
import ErrorFallback from "./ErrorFallback";

import useProjects from "modules/claroflow/hooks/useProjects";
import { useUsers } from "modules/claroflow/hooks/useUsers";
import useKPI from "modules/insight/hooks/useKPI";

import { ChevronDown, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "modules/shared/components/ui/dropdown-menu";
import { formatUserName } from "modules/shared/utils/formatUsername";

const DashboardModule = React.memo(() => {
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

  // Obtendo projetos usando o hook useProjects
  const {
    projects,
    fetchAssignments,
    loading: projectsLoading,
  } = useProjects();

  // Obtendo usuários usando o hook useUsers
  const { users } = useUsers(selectedAssignment);

  // Obtendo dados de KPI usando o hook useKPI com SWR
  const {
    queueTimeData,
    volumeData,
    teamPerformanceData,
    teamHeatmapData,
    radarData,
    loading: kpiLoading,
    error: kpiError,
    isValidating: kpiValidating,
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
    id: user._id,
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

      try {
        const assignmentsData = await fetchAssignments(selectedProject);
        const filteredAssignments = assignmentsData.filter(
          (assignment) => assignment.name !== "Finalizado",
        );
        setAssignments(filteredAssignments);
      } catch (error) {
        console.error("Erro ao carregar assignments:", error);
        setAssignments([]);
      }
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
    },
    [setPeriod],
  );

  // Função para selecionar um colaborador
  const handleTeamMemberSelect = useCallback(
    (member) => {
      setTeamMember(member);
      setShowTeamSelector(false);
    },
    [setTeamMember],
  );

  // Função para atualizar os dados manualmente
  const handleRefresh = useCallback(() => {
    refreshKPIData();
  }, [refreshKPIData]);

  // Estado de loading combinado
  const isLoading = projectsLoading || (kpiLoading && !kpiValidating);

  // Renderizar mensagem de erro (se houver)
  if (showError && kpiError && selectedProject && selectedAssignment) {
    return (
      <ErrorFallback
        error={kpiError}
        onRetry={handleRefresh}
        title="Erro ao carregar dados do dashboard"
        description="Ocorreu um erro ao carregar os dados do dashboard."
      />
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
                    key={member.id}
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
            className="flex w-36 items-center"
            onClick={handleRefresh}
            disabled={kpiValidating}
          >
            {kpiValidating ? (
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

      {/* Overlay de carregamento - apenas para carregamento inicial */}
      <AnimatePresence>
        {isLoading && (
          <LoadingFallback message="Carregando dados do dashboard..." />
        )}
      </AnimatePresence>

      {/* Indicador de revalidação - mais sutil */}
      <AnimatePresence>
        {kpiValidating && !isLoading && (
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
          className="flex h-[80vh] items-center justify-center rounded-lg border border-dashed border-border p-6"
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
            {kpiData && kpiData.length > 0 && (
              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                {kpiData.map((kpi, index) => (
                  <KPICard key={index} {...kpi} />
                ))}
              </div>
            )}

            {/* Gráficos */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <TeamPerformanceChart
                data={teamPerformanceData}
                loading={kpiLoading}
              />
              <TeamHeatmap data={teamHeatmapData} loading={kpiLoading} />
            </div>

            {/* Gráfico de Radar e Tabela */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <PerformanceRadarChart
                data={radarData}
                colaborador={teamMember || "Colaborador"}
                loading={kpiLoading}
              />
              {/* Dados fictícios para a tabela de status */}
              <DemandStatusTable
                data={[
                  {
                    id: "35611877",
                    titulo: "Análise",
                    responsavel: "Marcos Faria",
                    prioridade: "Alta",
                    status: "Finalizada",
                    prazo: new Date(2025, 5, 30).toISOString(),
                    progresso: 75,
                  },
                ]}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
});

DashboardModule.displayName = "DashboardModule";

export default DashboardModule;
