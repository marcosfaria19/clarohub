// useAssignmentBoard.js
// Hook responsável por gerenciar o estado e lógica do board de assignments.
import { useState, useEffect, useMemo, useCallback } from "react";
import { formatUserName } from "modules/shared/utils/formatUsername";

export const useAssignmentBoard = ({ project, getUsersByProjectId }) => {
  // Estados para as demandas (assignments), membros ativos, busca, etc.
  const [initialDemands, setInitialDemands] = useState([]);
  const [demands, setDemands] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Obtém os usuários do projeto atual
  const projectUsers = useMemo(() => {
    return project ? getUsersByProjectId(project._id) : [];
  }, [project, getUsersByProjectId]);

  // Formata os usuários para exibição no board
  const members = useMemo(
    () =>
      projectUsers
        .map((user) => ({
          ...user,
          id: user._id, // Define a propriedade id para compatibilidade
          name: formatUserName(user.NOME),
          avatar: user.avatar,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [projectUsers],
  );

  // Filtra os membros com base na busca
  const filteredMembers = useMemo(
    () =>
      members.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [members, searchQuery],
  );

  // Retorna o membro que está ativo (por drag ou seleção)
  const activeMember = useMemo(
    () => members.find((m) => m.id === activeId),
    [members, activeId],
  );

  // Verifica se houve mudanças comparando o estado inicial e o atual
  const hasChanges = useMemo(() => {
    if (initialDemands.length === 0 || demands.length === 0) return false;
    // Aqui pode ser substituído por uma função de comparação profunda mais performática, se necessário.
    return JSON.stringify(initialDemands) !== JSON.stringify(demands);
  }, [initialDemands, demands]);

  // Reseta o estado das demandas para o estado inicial
  const resetToInitialState = useCallback(() => {
    setDemands([...initialDemands]);
  }, [initialDemands]);

  // Atualiza a equipe mapeando as demandas para um formato apropriado para envio ao backend
  const updateTeamMembers = useCallback(async () => {
    try {
      const formattedAssignments = demands.map((demand) => ({
        id: demand.id,
        assignedUsers: demand.assigned,
      }));
      // Atualiza o estado inicial para o novo estado atual após a mudança
      setInitialDemands([...demands]);
      return formattedAssignments;
    } catch (error) {
      console.error("Erro ao aplicar mudanças:", error);
      throw error;
    }
  }, [demands]);

  // Atualiza os dados de regionais para um membro em uma demanda
  const updateRegional = useCallback((demandId, userId, regionals) => {
    setDemands((prev) =>
      prev.map((demand) => {
        if (demand.id === demandId) {
          return {
            ...demand,
            // Atualiza cada atribuição: se o userId corresponder, atualiza as regionals
            assigned: demand.assigned.map((assignment) =>
              assignment.userId === userId
                ? { ...assignment, regionals }
                : assignment,
            ),
          };
        }
        return demand;
      }),
    );
  }, []);

  // Efeito para detectar mudança no tamanho da tela (mobile ou não)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return {
    demands,
    setDemands,
    initialDemands,
    setInitialDemands,
    members,
    filteredMembers,
    activeMember,
    searchQuery,
    setSearchQuery,
    isMobile,
    activeId,
    setActiveId,
    hasChanges,
    resetToInitialState,
    updateTeamMembers,
    updateRegional,
  };
};
