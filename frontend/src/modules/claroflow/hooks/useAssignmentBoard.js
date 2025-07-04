// useAssignmentBoard.js
// Hook responsável por gerenciar o estado e lógica do board de assignments.
import { useState, useMemo, useCallback, useEffect } from "react";
import { formatUserName } from "modules/shared/utils/formatUsername";
import { useMediaQuery } from "modules/shared/hooks/use-media-query";
import axiosInstance from "services/axios";

export const useAssignmentBoard = ({ project, getUsersByProjectId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para as demandas (assignments), membros ativos, busca, etc.
  const [initialAssignments, setInitialAssignments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Obtém os usuários do projeto atual
  const projectUsers = useMemo(() => {
    return project ? getUsersByProjectId(project._id) : [];
  }, [project, getUsersByProjectId]);

  // Formata os usuários para exibição no board (ordem alfabetica, apenas id nome e avatar)
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
    if (initialAssignments.length === 0 || assignments.length === 0)
      return false;
    // Aqui pode ser substituído por uma função de comparação profunda mais performática, se necessário.
    return JSON.stringify(initialAssignments) !== JSON.stringify(assignments);
  }, [initialAssignments, assignments]);

  // Reseta o estado das demandas para o estado inicial
  const resetToInitialState = useCallback(() => {
    setAssignments([...initialAssignments]);
  }, [initialAssignments]);

  // Atualiza a equipe mapeando as demandas para um formato apropriado para envio ao backend
  const updateTeamMembers = useCallback(async () => {
    try {
      const formattedAssignments = assignments.map((assignment) => ({
        id: assignment.id,
        assignedUsers: assignment.assigned,
      }));
      // Atualiza o estado inicial para o novo estado atual após a mudança
      setInitialAssignments([...assignments]);
      return formattedAssignments;
    } catch (error) {
      console.error("Erro ao aplicar mudanças:", error);
      throw error;
    }
  }, [assignments]);

  // Retorna a equipe de um assignment específico (nome e avatar dos usuários atribuídos)
  const getTeamByAssignmentId = useCallback(
    (assignmentId) => {
      const assignment = assignments.find((a) => a.id === assignmentId);
      if (!assignment || !assignment.assigned) return [];

      return assignment.assigned
        .map(({ userId }) => projectUsers.find((user) => user._id === userId))
        .filter(Boolean)
        .map((user) => ({
          id: user._id,
          name: formatUserName(user.NOME),
          avatar: user.avatar,
        }));
    },
    [assignments, projectUsers],
  );

  const clearAssignments = useCallback(() => {
    setInitialAssignments([]);
    setAssignments([]);
    setActiveId(null);
    setSearchQuery("");
  }, []);

  // ✅ NOVO useEffect: Limpa estado quando o projeto muda
  useEffect(() => {
    // Limpa o estado quando o project._id muda
    if (project?._id) {
      setActiveId(null);
      setSearchQuery("");
    }
  }, [project?._id]);

  // Atualiza as assignments com os usuários atribuídos
  const assignUsers = async (projectId, assignments) => {
    try {
      setLoading(true);

      // Corrigido: usamos a propriedade "assignedUsers" e não "assigned"
      const formattedAssignments = assignments.map((assignment, index) => {
        // Caso a propriedade assignedUsers esteja ausente, forçamos para array vazio
        const usersArray = assignment.assignedUsers || [];
        return {
          id: assignment.id,
          assignedUsers: usersArray.map((user, userIndex) => {
            return {
              userId: user.userId,
            };
          }),
        };
      });

      const response = await axiosInstance.patch(
        `/flow/projects/${projectId}/assign-users`,
        { assignments: formattedAssignments },
      );

      // Atualiza o estado local para refletir as mudanças
      setProjects((prev) =>
        prev.map((p) =>
          p._id === projectId
            ? {
                ...p,
                assignments: p.assignments.map((a) => {
                  const updated = formattedAssignments.find(
                    (u) => u.id === a._id,
                  );
                  return updated
                    ? {
                        ...a,
                        assignedUsers: updated.assignedUsers.map((u) => ({
                          $oid: u.userId,
                        })),
                      }
                    : a;
                }),
              }
            : p,
        ),
      );

      return response.data;
    } catch (err) {
      console.error("Erro ao atualizar assignments:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return {
    assignments,
    setAssignments,
    initialAssignments,
    setInitialAssignments,
    clearAssignments,
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
    getTeamByAssignmentId,
    assignUsers,
    error,
    loading,
    projects,
  };
};
