import { Button } from "modules/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "modules/shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "modules/shared/components/ui/dropdown-menu";
import { Badge } from "modules/shared/components/ui/badge";
import { formatDate } from "modules/shared/utils/formatDate";
import useProjects from "modules/claroflow/hooks/useProjects";
import { useTasks } from "modules/claroflow/hooks/useTasks";
import {
  Hash,
  MapPin,
  Calendar,
  ArrowRight,
  Loader2,
  Building,
  MapPinned,
  Clock,
} from "lucide-react";
import { cn } from "modules/shared/lib/utils";

export function TaskCard({ task, isCompleted, onTransition, project }) {
  const { transitionLoading } = useProjects();
  const { transitionTask } = useTasks();

  // Get allowed transitions
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
    <Card
      className={cn(
        "group relative overflow-hidden rounded-lg border shadow-sm transition-all duration-300",
        isCompleted ? "border-success/40 bg-card" : "border-primary/40 bg-card",
      )}
    >
      {/* Barra de status no topo com maior contraste */}
      <div
        className={cn(
          "absolute left-0 top-0 h-1 w-full",
          isCompleted ? "bg-success" : "bg-primary",
        )}
      />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 pt-6">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "rounded-md p-1.5",
              isCompleted ? "bg-success/30" : "bg-primary/30",
            )}
          >
            <Hash
              className={cn(
                "h-4 w-4",
                isCompleted
                  ? "text-success-foreground"
                  : "text-primary-foreground",
              )}
            />
          </div>
          <CardTitle className="text-base font-semibold">
            {task.IDDEMANDA}
          </CardTitle>
        </div>

        {isCompleted ? (
          <Badge className="flex items-center gap-1.5 bg-success px-2.5 py-1 text-success-foreground shadow-sm">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">
              {formatDate(task.finishedAtByUser)}
            </span>
          </Badge>
        ) : (
          <Badge className="flex items-center gap-1.5 bg-primary px-2.5 py-1 text-primary-foreground shadow-sm">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Em tratamento</span>
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-4 pt-3">
        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <div
              className={cn(
                "mt-0.5 rounded-md p-1.5",
                isCompleted ? "bg-success/30" : "bg-primary/30",
              )}
            >
              <MapPin
                className={cn(
                  "h-4 w-4",
                  isCompleted
                    ? "text-success-foreground"
                    : "text-primary-foreground",
                )}
              />
            </div>
            <div className="flex-1">
              <p className="line-clamp-2 text-sm font-medium text-foreground">
                {task.ENDERECO_VISTORIA}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/80">
                  <MapPinned className="h-3.5 w-3.5" />
                  <span>
                    {task.CIDADE}/{task.UF}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/80">
                  <Building className="h-3.5 w-3.5" />
                  <span>Base: {task.BASE}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {!isCompleted && (
        <CardFooter className="flex justify-end p-4 pt-2">
          {nextAssignments?.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className={cn(
                    "gap-1.5 px-3 py-1.5 text-sm font-medium",
                    transitionLoading
                      ? "bg-primary/90"
                      : "bg-primary hover:bg-primary/90",
                  )}
                  disabled={transitionLoading}
                >
                  {transitionLoading ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Processando...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5">
                      <span>Concluir</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-lg border-border p-1.5 shadow-lg"
              >
                {nextAssignments.map((assignment) => (
                  <DropdownMenuItem
                    key={assignment._id}
                    onSelect={() => handleTransition(assignment._id)}
                    className="cursor-pointer rounded-md px-3 py-2 text-xs font-medium transition-colors hover:bg-primary/10"
                  >
                    {assignment.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground"
              disabled
            >
              Sem transições
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
