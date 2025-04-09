// AssignmentColumn.jsx
import { useDroppable } from "@dnd-kit/core";
import { Users } from "lucide-react";
import { Card } from "modules/shared/components/ui/card";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import AssignedUserCard from "./AssignedUserCard";
import { useAvailableTasks } from "modules/claroflow/hooks/useTasks";

/**
 * AssignmentColumn
 * Componente que renderiza uma coluna de assignment contendo o nome do assignment e a lista
 * de usuários atribuídos, com suporte a drag & drop.
 *
 * Props:
 * - assignment: Objeto do assignment contendo id, name, assigned e possivelmente outras propriedades.
 * - members: Lista de membros disponíveis para buscar os dados do usuário.
 * - onUnassign: Função para desatribuir um usuário do assignment.
 * - onUpdateRegional: Função para atualizar as regionals de um usuário.
 */
const AssignmentColumn = ({
  assignment,
  members,
  onUnassign,
  onUpdateRegional,
}) => {
  // Configura o droppable para o container da coluna (para drag & drop)
  const { setNodeRef, isOver } = useDroppable({ id: assignment.id });
  const { tasks } = useAvailableTasks(assignment.id);

  return (
    <Card className="flex min-w-72 flex-1 flex-col border border-border bg-card">
      {/* Cabeçalho da coluna com nome do assignment e contagem de usuários atribuídos */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-card-foreground">
            {assignment.name}
            <span className="text-base text-foreground/40">
              {" "}
              ({tasks.length})
            </span>
          </h3>
          <div className="text-md flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{assignment.assigned.length}</span>
          </div>
        </div>
      </div>

      <ScrollArea className="h-full flex-1">
        {/* Área droppable para os cartões de usuários atribuídos */}
        <div
          ref={setNodeRef}
          className={`space-y-2 p-4 ${isOver ? "bg-accent/20" : ""}`}
        >
          {assignment.assigned.map((assignedUser, index) => {
            // Busca o membro correspondente, comparando o userId do assignedUser com os IDs dos membros
            const member = members.find(
              (m) =>
                m._id === assignedUser.userId || m.id === assignedUser.userId,
            );
            return (
              <AssignedUserCard
                key={index}
                assignment={assignedUser}
                member={member}
                assignmentId={assignment.id}
                onUnassign={onUnassign}
                onUpdateRegional={onUpdateRegional}
              />
            );
          })}

          {/* Exibe uma área para "Arraste aqui" quando não há usuários atribuídos */}
          {assignment.assigned.length === 0 && (
            <div className="mt-2 flex h-12 items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground">
              Arraste aqui
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default AssignmentColumn;
