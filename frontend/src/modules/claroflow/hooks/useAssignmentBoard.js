import { useState, useEffect, useMemo, useCallback } from "react";
import { formatUserName } from "modules/shared/utils/formatUsername";

export const useAssignmentBoard = ({ project, getUsersByProjectId }) => {
  const [initialDemands, setInitialDemands] = useState([]);
  const [demands, setDemands] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const projectUsers = useMemo(() => {
    return project ? getUsersByProjectId(project._id) : [];
  }, [project, getUsersByProjectId]);

  const members = useMemo(
    () =>
      projectUsers
        .map((user) => ({
          ...user,
          id: user._id,
          name: formatUserName(user.NOME),
          avatar: user.avatar,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [projectUsers],
  );

  const filteredMembers = useMemo(
    () =>
      members.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [members, searchQuery],
  );

  const activeMember = useMemo(
    () => members.find((m) => m.id === activeId),
    [members, activeId],
  );

  const hasChanges = useMemo(() => {
    if (initialDemands.length === 0 || demands.length === 0) return false;
    return JSON.stringify(initialDemands) !== JSON.stringify(demands);
  }, [initialDemands, demands]);

  const resetToInitialState = useCallback(() => {
    setDemands([...initialDemands]);
  }, [initialDemands]);

  const updateTeamMembers = useCallback(async () => {
    try {
      const formattedAssignments = demands.map((demand) => ({
        id: demand.id,
        assignedUsers: demand.assigned,
      }));

      // Atualiza o estado inicial após sucesso
      setInitialDemands([...demands]);

      return formattedAssignments;
    } catch (error) {
      console.error("Erro ao aplicar mudanças:", error);
      throw error;
    }
  }, [demands]);

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
  };
};
