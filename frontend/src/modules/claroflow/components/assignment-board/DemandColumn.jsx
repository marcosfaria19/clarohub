import { useDroppable } from "@dnd-kit/core";
import { Users } from "lucide-react";
import { Card } from "modules/shared/components/ui/card";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import AssignedUserCard from "./AssignedUserCard";

/**
 * DemandColumn
 * Componente que renderiza uma coluna de demanda contendo o nome da demanda
 * e a lista de usuários atribuídos, com suporte a drag & drop.
 *
 * Props:
 * - demand: Objeto da demanda contendo id, nome e array de assignments.
 * - members: Lista de membros disponíveis para buscar os dados do usuário.
 * - onUnassign: Função para desatribuir um usuário da demanda.
 * - onUpdateRegional: Função para atualizar as regionals de um usuário.
 */
const DemandColumn = ({ demand, members, onUnassign, onUpdateRegional }) => {
  // Configura o droppable para o container da coluna (para drag & drop)
  const { setNodeRef, isOver } = useDroppable({ id: demand.id });

  return (
    <Card className="flex min-w-72 flex-1 flex-col border border-border bg-card">
      {/* Cabeçalho da coluna com nome da demanda e contagem de assignments */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-card-foreground">
            {demand.name}
          </h3>
          <div className="text-md flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{demand.assigned.length}</span>
          </div>
        </div>
      </div>

      <ScrollArea className="h-full flex-1">
        {/* Área droppable para os cartões de usuários atribuídos */}
        <div
          ref={setNodeRef}
          className={`space-y-2 p-4 ${isOver ? "bg-accent/20" : ""}`}
        >
          {demand.assigned.map((assignment, index) => {
            // Busca o membro correspondente à assignment, verificando as propriedades _id ou id.
            const member = members.find(
              (m) => m._id === assignment.userId || m.id === assignment.userId,
            );
            // Renderiza o cartão do usuário atribuído, utilizando o componente AssignedUserCard.
            return (
              <AssignedUserCard
                key={index}
                assignment={assignment}
                member={member}
                demandId={demand.id}
                onUnassign={onUnassign}
                onUpdateRegional={onUpdateRegional}
              />
            );
          })}

          {/* Exibe uma área para "Arraste aqui" quando não há assignments */}
          {demand.assigned.length === 0 && (
            <div className="mt-2 flex h-12 items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground">
              Arraste aqui
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default DemandColumn;
