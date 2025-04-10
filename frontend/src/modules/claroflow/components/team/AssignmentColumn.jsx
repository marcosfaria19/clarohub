import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Users } from "lucide-react";
import { Card } from "modules/shared/components/ui/card";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import AssignedUserCard from "./AssignedUserCard";

/**
 * AssignmentColumn
 * Renderiza a coluna de assignment com nome, contagem de tasks e usuários atribuídos.
 * Possui um ícone ao lado do título que, ao ser clicado, exibe o gráfico de tasks por regional.
 */
const AssignmentColumn = ({
  assignment,
  members,
  onUnassign,
  onUpdateRegional,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: assignment.id });

  return (
    <Card className="flex min-w-72 flex-1 flex-col border border-border bg-card">
      {/* Cabeçalho da coluna */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Nome da coluna e gráfico */}
          <h3 className="text-lg font-medium text-card-foreground">
            {assignment.name}
          </h3>

          <div className="flex items-center gap-3">
            {/* Implementação para mostrar gráficos de demandas por regionais */}
            {/* <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 px-2 text-muted-foreground hover:text-foreground"
                >
                  <BarChartIcon className="h-4 w-4" />
                  <span className="ml-1 font-normal">{tasks.length}</span>
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[400px] bg-background">
                <DemandChart tasks={tasks} />
              </PopoverContent>
            </Popover> */}

            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm">{assignment.assigned.length}</span>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="h-full flex-1">
        <div
          ref={setNodeRef}
          className={`space-y-2 p-4 ${isOver ? "bg-accent/20" : ""}`}
        >
          {assignment.assigned.map((assignedUser, index) => {
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
