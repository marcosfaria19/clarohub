import { Button } from "modules/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "modules/shared/components/ui/card";

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
  CheckCircle2,
} from "lucide-react";
import { cn } from "modules/shared/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "modules/shared/components/ui/dialog";
import { useState } from "react";

export function TaskCard({ task, isCompleted, onTransition, project }) {
  const { transitionLoading } = useProjects();
  const { transitionTask } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [confirmationStep, setConfirmationStep] = useState(false);

  // Próximas filas permitidas
  const currentAssignment = project?.assignments?.find(
    (a) => a._id === task.status._id,
  );
  const nextAssignments = currentAssignment?.transitions
    ?.map((id) => project.assignments.find((a) => a._id === id))
    .filter(Boolean);

  const handleSelectAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setConfirmationStep(true);
  };

  const handleTransition = async () => {
    if (!selectedAssignment) return;

    const success = await transitionTask(
      task._id,
      selectedAssignment._id,
      project._id,
    );

    if (success) {
      setModalOpen(false);
      setSelectedAssignment(null);
      setConfirmationStep(false);
      onTransition?.();
    }
  };

  const resetModal = () => {
    setSelectedAssignment(null);
    setConfirmationStep(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    resetModal();
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
                  ? "text-green-500"
                  : "text-primary brightness-[1.6]",
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
                    ? "text-green-500"
                    : "text-primary brightness-[1.6]",
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
            <>
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
                onClick={() => setModalOpen(true)}
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

              <Dialog open={modalOpen} onOpenChange={handleCloseModal}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader className="pb-0">
                    <DialogTitle className="text-xl">
                      {confirmationStep
                        ? "Confirmar transição"
                        : "Selecione a próxima fila"}
                    </DialogTitle>
                    {!confirmationStep && (
                      <DialogDescription className="pt-2">
                        Para qual fila você deseja enviar esta demanda?
                      </DialogDescription>
                    )}
                  </DialogHeader>

                  {!confirmationStep ? (
                    <div className="grid gap-3 py-4">
                      {nextAssignments.map((assignment) => (
                        <Button
                          key={assignment._id}
                          variant="outline"
                          className="w-full justify-start gap-2 py-6 hover:bg-primary hover:text-primary-foreground"
                          onClick={() => handleSelectAssignment(assignment)}
                        >
                          <ArrowRight className="h-4 w-4" />
                          {assignment.name}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4 rounded-lg border border-border/60 bg-card p-5 shadow-sm">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">
                              Demanda:
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              {task.IDDEMANDA}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">
                              Destino:
                            </span>
                            <span className="text-sm font-medium text-primary brightness-150">
                              {selectedAssignment?.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button
                          variant="secondary"
                          className="sm:w-auto"
                          onClick={() => setConfirmationStep(false)}
                          disabled={transitionLoading}
                        >
                          Voltar
                        </Button>
                        <Button
                          variant="default"
                          className="gap-2 sm:w-auto"
                          onClick={handleTransition}
                          disabled={transitionLoading}
                        >
                          {transitionLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Processando...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Confirmar</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {!confirmationStep && (
                    <DialogFooter className="sm:justify-end">
                      <Button
                        variant="secondary"
                        onClick={handleCloseModal}
                        className="w-full sm:w-auto"
                      >
                        Cancelar
                      </Button>
                    </DialogFooter>
                  )}
                </DialogContent>
              </Dialog>
            </>
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
