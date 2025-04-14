import React from "react";
import { Button } from "modules/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "modules/shared/components/ui/dropdown-menu";
import { formatDate } from "modules/shared/utils/formatDate";
import useProjects from "modules/claroflow/hooks/useProjects";
import { useTasks } from "modules/claroflow/hooks/useTasks";

export function TaskCard({ task, isCompleted, onTransition, project }) {
  const { transitionLoading } = useProjects();
  const { transitionTask } = useTasks();

  // Obter transições permitidas
  const currentAssignment = project?.assignments?.find(
    (a) => a._id === task.status._id,
  );
  const nextAssignments = currentAssignment?.transitions
    ?.map((id) => project.assignments.find((a) => a._id === id))
    .filter(Boolean);

  const handleTransition = async (newStatusId) => {
    const success = await transitionTask(task._id, newStatusId, project._id);
    if (success) {
      onTransition?.();
    }
  };

  return (
    <Card className="group rounded-lg border-border bg-background shadow-sm transition-all hover:bg-accent/40 hover:opacity-80">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base font-semibold">
          <span>#{task.IDDEMANDA}</span>
          {isCompleted && (
            <span className="text-sm text-muted-foreground">
              {formatDate(task.finishedAtByUser)}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Local:
            </span>
            <span className="text-sm text-foreground">
              {task.CIDADE}/{task.UF}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Endereço:
            </span>
            <span className="line-clamp-1 text-sm text-foreground">
              {task.ENDERECO_VISTORIA}
            </span>
          </div>
        </div>

        {!isCompleted && (
          <div className="mt-4 flex gap-2">
            {nextAssignments?.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={transitionLoading}
                  >
                    {transitionLoading
                      ? "Processando..."
                      : "Marcar como Concluído"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {nextAssignments.map((assignment) => (
                    <DropdownMenuItem
                      key={assignment._id}
                      onSelect={() => handleTransition(assignment._id)}
                    >
                      {assignment.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <span className="text-sm text-muted-foreground">
                Nenhuma transição disponível
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
