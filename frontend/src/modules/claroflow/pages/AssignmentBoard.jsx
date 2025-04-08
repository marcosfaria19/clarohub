// AssignmentBoard.jsx
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

import TeamPanel from "../components/assignment-board/TeamPanel";
import DemandsBoard from "../components/assignment-board/DemandsBoard";
import AssignmentOverlay from "../components/assignment-board/AssignmentOverlay";
import { useAssignmentBoard } from "../hooks/useAssignmentBoard";
import ChangeNotification from "../components/assignment-board/ChangesNotification";
import { toast } from "sonner";
import useNotifications from "modules/shared/hooks/useNotifications";

const AssignmentBoard = ({ project }) => {
  // Obtém funções e estados dos hooks
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
        // Garante que cada usuário atribuído contenha userId e regionals
        assigned: assignment.assignedUsers.map((user) => ({
          userId:
            typeof user.userId === "object" ? user.userId.$oid : user.userId,
          regionals: user.regionals,
        })),
      }));

  // Efeito para carregar as assignments do projeto quando o componente monta
  useEffect(() => {
    let isMounted = true;

    const loadAssignments = async () => {
      if (project?._id && initialDemands.length === 0) {
        const assignments = await fetchAssignments(project._id);
        if (assignments && isMounted) {
          const formattedAssignments = formatAssignments(assignments);
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
        demands.some((demand) => demand.id === over.id) &&
        over.id !== active.id
      ) {
        setDemands((prev) =>
          prev.map((demand) =>
            demand.id === over.id
              ? {
                  ...demand,
                  assigned: [
                    ...demand.assigned,
                    {
                      userId: active.id,
                      regionals: [],
                    },
                  ],
                }
              : demand,
          ),
        );
      }
      setActiveId(null);
    },
    [demands, setDemands, setActiveId],
  );

  // Remove um membro da demand (desatribuição)
  const handleUnassign = useCallback(
    (memberId, demandId) => {
      setDemands((prev) =>
        prev.map((demand) =>
          demand.id === demandId
            ? {
                ...demand,
                assigned: demand.assigned.filter((a) => a.userId !== memberId),
              }
            : demand,
        ),
      );
    },
    [setDemands],
  );

  // Atualiza os dados de regionals para uma determinada demand e membro
  const handleUpdateRegional = useCallback(
    (demandId, memberId, regionals) => {
      setDemands((prev) =>
        prev.map((demand) =>
          demand.id === demandId
            ? {
                ...demand,
                // Aqui assume-se que a estrutura de regionals é um objeto indexado pelo memberId
                regionals: {
                  ...demand.regionals,
                  [memberId]: regionals,
                },
              }
            : demand,
        ),
      );
    },
    [setDemands],
  );

  // Aplica as mudanças chamando a função de atualização e disparando notificações para novos membros
  const handleApplyChanges = async () => {
    try {
      const assignmentsToUpdate = await updateTeamMembers();
      await assignUsers(project._id, assignmentsToUpdate);

      // Verifica os membros novos para disparar notificações
      demands.forEach((currentDemand) => {
        const initialDemand = initialDemands.find(
          (d) => d.id === currentDemand.id,
        );
        const newUsers = currentDemand.assigned.filter((assignment) => {
          // Aqui a comparação pode ser aprimorada: se necessário, comparar apenas os IDs dos usuários
          return !initialDemand?.assigned.some(
            (initAssign) => initAssign.userId === assignment.userId,
          );
        });
        newUsers.forEach((assignment) => {
          createUserNotification(
            assignment.userId,
            "flow",
            `Você foi alocado à demanda de ${currentDemand.name}`,
          );
        });
      });

      toast.success("Equipe atualizada com sucesso!");
    } catch (error) {
      toast.error("Falha ao atualizar equipe. Tente novamente mais tarde.");
      console.error("Erro ao aplicar mudanças:", error);
    }
  };

  // Descarta as mudanças, resetando o estado para o inicial
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
            onUpdateRegional={handleUpdateRegional}
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
