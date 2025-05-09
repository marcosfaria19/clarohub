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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "modules/shared/components/ui/tooltip";
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
  ExternalLink,
} from "lucide-react";

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
    <Card className="relative overflow-hidden rounded-xl border border-border bg-background shadow-md transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
      <div className="absolute left-0 top-0 h-[2px] w-full bg-secondary" />

      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/15 p-1.5">
              <Hash className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold text-card-foreground">
              {task.IDDEMANDA}
            </CardTitle>
          </div>

          {isCompleted && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100"
                  >
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs">
                      {formatDate(task.finishedAtByUser)}
                    </span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Completed on {formatDate(task.finishedAtByUser)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-start gap-3 py-2">
            <div className="mt-0.5 rounded-lg bg-muted p-1.5">
              <MapPin className="h-4 w-4 text-primary/80" />
            </div>
            <div className="flex-1">
              <p className="line-clamp-2 text-sm font-medium text-card-foreground">
                {task.ENDERECO_VISTORIA}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPinned className="h-3 w-3" />
                  <span>
                    {task.CIDADE}/{task.UF}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Building className="h-3 w-3" />
                  <span>Base: {task.BASE}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {!isCompleted && (
        <CardFooter className="flex gap-2 pt-1">
          <Button variant="secondary" size="sm" className="flex-1 gap-1">
            <ExternalLink className="h-3.5 w-3.5" />
            Detalhes
          </Button>

          {nextAssignments?.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 gap-1"
                  disabled={transitionLoading}
                >
                  {transitionLoading ? (
                    <span className="flex items-center justify-center gap-1">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span className="text-xs font-medium">
                        Processando...
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1">
                      <span className="text-sm font-medium">Concluir</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-lg border-muted-foreground/20 p-1 shadow-lg"
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
              className="flex-1 bg-muted text-muted-foreground"
              disabled
            >
              <span className="text-xs font-medium">Sem transições</span>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
