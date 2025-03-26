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

import TeamPanel from "../components/assignment-board/TeamPanel";
import DemandsBoard from "../components/assignment-board/DemandsBoard";
import AssignmentOverlay from "../components/assignment-board/AssignmentOverlay";
import { useAssignmentBoard } from "../hooks/useAssignmentBoard";
import ChangeNotification from "../components/assignment-board/ChangesNotification";
import { toast } from "sonner";
import useNotifications from "modules/shared/hooks/useNotifications";

const AssignmentBoard = ({ project }) => {
  const { getUsersByProjectId } = useUsers();
  const { fetchAssignments, assignUsers } = useProjects();
  const {
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
    setActiveId,
    hasChanges,
    resetToInitialState,
    updateTeamMembers,
  } = useAssignmentBoard({ project, getUsersByProjectId });

  const customOffsetModifier = ({ transform }) => {
    if (!transform) return transform;
    return {
      ...transform,
      x: transform.x - 100,
      y: transform.y - 140,
    };
  };

  const { createUserNotification } = useNotifications();

  useEffect(() => {
    let isMounted = true;

    const loadAssignments = async () => {
      if (project?._id && initialDemands.length === 0) {
        const assignments = await fetchAssignments(project._id);

        if (assignments && isMounted) {
          const formattedAssignments = assignments.map((assignment) => ({
            id: assignment._id,
            name: assignment.name,
            assigned: assignment.assignedUsers.map((user) =>
              typeof user === "object" ? user.$oid : user,
            ),
          }));

          setInitialDemands(formattedAssignments);
          setDemands(formattedAssignments);
        }
      }
    };

    loadAssignments();

    return () => {
      isMounted = false;
    };
  }, [
    project,
    initialDemands.length,
    setInitialDemands,
    setDemands,
    fetchAssignments,
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = useCallback(
    (event) => {
      setActiveId(event.active.id);
    },
    [setActiveId],
  );

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      const isValidDrop = demands.some((demand) => demand.id === over?.id);

      if (isValidDrop && over.id !== active.id) {
        setDemands((prev) =>
          prev.map((demand) =>
            demand.id === over.id
              ? {
                  ...demand,
                  assigned: [...new Set([...demand.assigned, active.id])],
                }
              : demand,
          ),
        );
      }
      setActiveId(null);
    },
    [demands, setDemands, setActiveId],
  );

  const handleUnassign = useCallback(
    (memberId, demandId) => {
      setDemands((prev) =>
        prev.map((demand) =>
          demand.id === demandId
            ? {
                ...demand,
                assigned: demand.assigned.filter((id) => id !== memberId),
              }
            : demand,
        ),
      );
    },
    [setDemands],
  );

  const handleApplyChanges = async () => {
    try {
      // Formata os dados para o backend
      const assignmentsToUpdate = await updateTeamMembers();

      // Envia para o backend
      await assignUsers(project._id, assignmentsToUpdate);

      // Verificar novas alocações e enviar notificações
      demands.forEach((currentDemand) => {
        const initialDemand = initialDemands.find(
          (d) => d.id === currentDemand.id,
        );

        // Usuários recém-alocados
        const newUsers = currentDemand.assigned.filter(
          (userId) => !initialDemand?.assigned.includes(userId),
        );

        newUsers.forEach((userId) => {
          createUserNotification(
            userId,
            "flow",
            `Você foi alocado à demanda de ${currentDemand.name}`,
          );
        });
      });

      // Feedback visual
      toast.success("Equipe atualizada com sucesso!");
    } catch (error) {
      toast.error("Falha ao atualizar equipe:", error);
      console.error("Erro ao aplicar mudanças:", error);
    }
  };

  const handleDiscardChanges = () => {
    resetToInitialState();
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
            demands={demands}
            isMobile={isMobile}
            className={isMobile ? "h-[400px]" : "h-full"}
          />

          <DemandsBoard
            demands={demands}
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

export default AssignmentBoard;
