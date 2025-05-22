import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { CheckCircle, Users, Gauge } from "lucide-react";
import { Card } from "modules/shared/components/ui/card";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import AssignedUserCard from "./AssignedUserCard";
import { useTasks } from "modules/claroflow/hooks/useTasks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "modules/shared/components/ui/tooltip";

const AssignmentColumn = ({
  assignment,
  members,
  onUnassign,
  onUpdateRegional,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: assignment.id });

  const { availableTasks } = useTasks({
    assignmentId: assignment.id,
  });

  const assignedCount = assignment.assigned.length;
  const divisor = assignedCount === 0 ? 1 : assignedCount;
  const averageTasks = Math.floor((availableTasks?.length || 0) / divisor);

  return (
    <Card className="flex min-w-72 flex-1 flex-col border border-border bg-card">
      <TooltipProvider>
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-card-foreground">
              {assignment.name}
            </h3>

            <div className="flex items-center gap-4 text-muted-foreground">
              {/* Contagem de tarefas disponíveis */}
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1">
                      <CheckCircle
                        className={`h-4 w-4 ${availableTasks?.length === 0 ? "text-muted" : "text-green-500"}`}
                      />
                      <span className="text-sm">{availableTasks?.length}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    Demandas disponíveis
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Contagem de usuários atribuídos */}
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{assignedCount}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    Usuários atribuídos
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Média de demandas por usuário */}
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1">
                      <Gauge className="h-4 w-4" />
                      <span className="text-sm">{averageTasks}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    Média de demandas por usuário
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>

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
