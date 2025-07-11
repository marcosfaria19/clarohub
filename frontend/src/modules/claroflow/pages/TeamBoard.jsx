// TeamBoard.jsx
// Componente principal que gerencia o board de assignments com funcionalidades de drag and drop.
import { useEffect, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useUsers } from "../hooks/useUsers";
import useProjects from "../hooks/useProjects";

import TeamPanel from "../components/team/TeamPanel";
import AssignmentsBoard from "../components/team/AssignmentsBoard";
import AssignmentOverlay from "../components/team/AssignmentOverlay";
import { useAssignmentBoard } from "../hooks/useAssignmentBoard";
import ChangeNotification from "../components/team/ChangesNotification";
import { toast } from "sonner";
import useNotifications from "modules/shared/hooks/useNotifications";

const TeamBoard = ({ project }) => {
  // Obtém funções e estados dos hooks
  const { getUsersByProjectId } = useUsers();
  const { fetchAssignments } = useProjects();
  const {
    assignments,
    setAssignments,
    initialAssignments,
    setInitialAssignments,
    members,
    filteredMembers,
    activeMember,
    searchQuery,
    setSearchQuery,
    isMobile,
    setActiveId,
    hasChanges,
    resetToInitialState,
    updateTeamMembers,
    assignUsers,
    clearAssignments,
  } = useAssignmentBoard({ project, getUsersByProjectId });

  // Modificador customizado para ajuste do offset do drag
  const customOffsetModifier = ({ transform }) => {
    if (!transform) return transform;
    return {
      ...transform,
      x: transform.x - 100,
      y: transform.y - 140,
    };
  };

  const { createUserNotification } = useNotifications();

  // Função auxiliar para transformar as assignments vindas do backend
  const formatAssignments = (assignments) =>
    assignments
      .filter((assignment) => assignment.name !== "Finalizado")
      .map((assignment) => ({
        id: assignment._id,
        name: assignment.name,
        assigned: assignment.assignedUsers.map((user) => ({
          userId: user.userId,
        })),
      }));

  // Efeito para carregar as assignments do projeto quando o componente monta
  useEffect(() => {
    let isMounted = true;

    const loadAssignments = async () => {
      if (project?._id) {
        clearAssignments();

        try {
          const assignments = await fetchAssignments(project._id);
          if (assignments && isMounted) {
            const formattedAssignments = formatAssignments(assignments);
            setInitialAssignments(formattedAssignments);
            setAssignments(formattedAssignments);
          }
        } catch (error) {
          console.error("Erro ao carregar assignments:", error);

          setInitialAssignments([]);
          setAssignments([]);
        }
      }
    };

    loadAssignments();

    return () => {
      isMounted = false;
    };
  }, [
    project?._id,
    fetchAssignments,
    setInitialAssignments,
    setAssignments,
    clearAssignments,
  ]);

  // Configuração dos sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor),
  );

  // Handler chamado quando inicia o drag
  const handleDragStart = useCallback(
    (event) => {
      setActiveId(event.active.id);
    },
    [setActiveId],
  );

  // Handler chamado ao finalizar o drag, atualiza as assignments adicionando o membro à demanda
  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (
        over &&
        assignments.some((assignment) => assignment.id === over.id) &&
        over.id !== active.id
      ) {
        setAssignments((prev) =>
          prev.map((assignment) => {
            if (assignment.id !== over.id) return assignment;

            const alreadyAssigned = assignment.assigned.some(
              (a) => a.userId === active.id,
            );

            // Evita duplicidade
            if (alreadyAssigned) return assignment;

            return {
              ...assignment,
              assigned: [
                ...assignment.assigned,
                {
                  userId: active.id,
                },
              ],
            };
          }),
        );
      }
      setActiveId(null);
    },
    [assignments, setAssignments, setActiveId],
  );

  // Remove um membro da demand (desatribuição)
  const handleUnassign = useCallback(
    (memberId, assignmentId) => {
      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === assignmentId
            ? {
                ...assignment,
                assigned: assignment.assigned.filter(
                  (a) => a.userId !== memberId,
                ),
              }
            : assignment,
        ),
      );
    },
    [setAssignments],
  );

  // Aplica as mudanças chamando a função de atualização e disparando notificações para novos membros
  const handleApplyChanges = async () => {
    try {
      const assignmentsToUpdate = await updateTeamMembers();

      await assignUsers(project._id, assignmentsToUpdate);

      // Notificar novos membros
      assignments.forEach((currentAssignment) => {
        const initialAssignment = initialAssignments.find(
          (d) => d.id === currentAssignment.id,
        );

        const newUsers = currentAssignment.assigned.filter((assignment) => {
          return !initialAssignment?.assigned.some(
            (initAssign) => initAssign.userId === assignment.userId,
          );
        });

        newUsers.forEach((assignment) => {
          createUserNotification(
            assignment.userId,
            "flow",
            `Você foi alocado à demanda de ${currentAssignment.name}`,
          );
        });
      });

      toast.success("Equipe atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao aplicar mudanças:", error);

      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.blockedRemovals
      ) {
        const conflicts = error.response.data.blockedRemovals;

        const conflictMessages = conflicts.map(
          (conflict) =>
            `• ${conflict.userName} não pode ser removido de ${conflict.assignmentName} (possui ${conflict.tasksInProgress} tarefa(s) em andamento)`,
        );

        toast.error(
          `Não foi possível aplicar as alterações:\n${conflictMessages.join("\n")}`,
          { duration: 8000 },
        );

        handleDiscardChanges();
      } else {
        toast.error("Falha ao atualizar equipe. Tente novamente mais tarde.");
      }
    }
  };

  // Descarta as mudanças, resetando o estado para o inicial
  const handleDiscardChanges = () => {
    resetToInitialState();
    setInitialAssignments([...initialAssignments]);
  };
  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges, customOffsetModifier]}
        collisionDetection={closestCenter}
      >
        <div
          className={`flex ${isMobile ? "h-full flex-col" : "h-[calc(100dvh-230px)] flex-row"}`}
        >
          <TeamPanel
            members={filteredMembers}
            searchQuery={searchQuery}
            onSearchChange={(e) => setSearchQuery(e.target.value)}
            assignments={assignments}
            isMobile={isMobile}
            className={isMobile ? "h-[400px]" : "h-full"}
          />

          <AssignmentsBoard
            assignments={assignments}
            members={members}
            onUnassign={handleUnassign}
            isMobile={isMobile}
            className="h-full"
          />

          <DragOverlay
            adjustScale={false}
            dropAnimation={null}
            modifiers={[restrictToWindowEdges]}
          >
            <AssignmentOverlay activeMember={activeMember} />
          </DragOverlay>
        </div>
      </DndContext>

      <ChangeNotification
        hasChanges={hasChanges}
        onApply={handleApplyChanges}
        onDiscard={handleDiscardChanges}
      />
    </>
  );
};

export default TeamBoard;
