import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVacation } from "./VacationContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "modules/shared/components/ui/dialog";
import { Button } from "modules/shared/components/ui/button";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import { Textarea } from "modules/shared/components/ui/textarea";

import {
  UserIcon,
  CheckIcon,
  XIcon,
  CalendarIcon,
  ClockIcon,
} from "lucide-react";
import { cn } from "modules/shared/lib/utils";
import VacationStatusBadge from "./VacationStatusBadge";

const VacationApprovalFlow = React.memo(({ className = "" }) => {
  const {
    getVacationsByStatus,
    approveVacation,
    rejectVacation,
    loading: contextLoading,
  } = useVacation();

  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedVacation, setSelectedVacation] = useState(null);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const pendingVacations = getVacationsByStatus("PENDING");

  const formatDate = useCallback((date) => {
    return date.toLocaleDateString("pt-BR");
  }, []);

  const calculateDuration = useCallback((startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }, []);

  const handleApprove = useCallback(
    async (vacation) => {
      try {
        setLoading(true);
        await approveVacation(vacation.id, "Maria Gestora");
      } catch (error) {
        console.error("Error approving vacation:", error);
      } finally {
        setLoading(false);
      }
    },
    [approveVacation],
  );

  const handleReject = useCallback(async () => {
    if (!selectedVacation || !rejectionReason.trim()) return;

    try {
      setLoading(true);
      await rejectVacation(
        selectedVacation.id,
        "Maria Gestora",
        rejectionReason,
      );
      setRejectionDialogOpen(false);
      setRejectionReason("");
      setSelectedVacation(null);
    } catch (error) {
      console.error("Error rejecting vacation:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedVacation, rejectionReason, rejectVacation]);

  const openRejectionDialog = useCallback((vacation) => {
    setSelectedVacation(vacation);
    setRejectionDialogOpen(true);
  }, []);

  const openDetailsDialog = useCallback((vacation) => {
    setSelectedVacation(vacation);
    setDetailsDialogOpen(true);
  }, []);

  const renderEmptyState = useCallback(() => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-[300px] flex-col items-center justify-center text-center text-muted-foreground"
      >
        <CalendarIcon className="mb-2 h-12 w-12 opacity-20" />
        <h3 className="text-lg font-medium">Nenhuma solicitação pendente</h3>
        <p className="max-w-xs text-sm">
          Todas as solicitações de férias foram processadas.
        </p>
      </motion.div>
    );
  }, []);

  const renderVacationCard = useCallback(
    (vacation) => {
      const duration = calculateDuration(vacation.startDate, vacation.endDate);

      return (
        <motion.div
          key={vacation.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-4 rounded-lg border p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <UserIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">{vacation.employee}</h4>
                <p className="text-sm text-muted-foreground">
                  {vacation.department}
                </p>
              </div>
            </div>
            <VacationStatusBadge status={vacation.status} />
          </div>

          <div className="mb-3 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Data Inicial</p>
              <p className="font-medium">{formatDate(vacation.startDate)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Data Final</p>
              <p className="font-medium">{formatDate(vacation.endDate)}</p>
            </div>
          </div>

          <div className="mb-3 flex items-center gap-2 text-sm">
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
            <span>
              <span className="font-medium">{duration}</span> dias de férias
            </span>
          </div>

          {vacation.notes && (
            <div className="mb-4 rounded-md bg-secondary p-2 text-sm">
              <p className="text-xs font-medium text-muted-foreground">
                Observações:
              </p>
              <p>{vacation.notes}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              size="sm"
              className="w-full gap-1 bg-success hover:bg-success/80"
              onClick={() => handleApprove(vacation)}
              disabled={loading || contextLoading}
            >
              <CheckIcon className="h-4 w-4" />
              Aprovar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => openRejectionDialog(vacation)}
              disabled={loading || contextLoading}
            >
              <XIcon className="h-4 w-4" />
              Rejeitar
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full"
            onClick={() => openDetailsDialog(vacation)}
          >
            Ver detalhes
          </Button>
        </motion.div>
      );
    },
    [
      calculateDuration,
      formatDate,
      handleApprove,
      openRejectionDialog,
      openDetailsDialog,
      loading,
      contextLoading,
    ],
  );

  return (
    <>
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>Férias Pendentes</CardTitle>
          <CardDescription>
            {pendingVacations.length} solicitações aguardando aprovação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <AnimatePresence mode="wait">
              {pendingVacations.length === 0 ? (
                renderEmptyState()
              ) : (
                <div className="space-y-4">
                  {pendingVacations.map(renderVacationCard)}
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4 text-sm text-muted-foreground">
          Aprove ou rejeite as solicitações de férias pendentes
        </CardFooter>
      </Card>

      {/* Rejection Dialog substituído */}
      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Solicitação de Férias</DialogTitle>
            <DialogDescription>
              Você está rejeitando a solicitação de férias de{" "}
              <span className="font-medium">{selectedVacation?.employee}</span>.
              Por favor, forneça um motivo para a rejeição.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Motivo da rejeição"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectionDialogOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleReject}
              disabled={!rejectionReason.trim() || loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Rejeitar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog mantido igual */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre a solicitação de férias
            </DialogDescription>
          </DialogHeader>

          {selectedVacation && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{selectedVacation.employee}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedVacation.department}
                    </p>
                  </div>
                </div>
                <VacationStatusBadge status={selectedVacation.status} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Data Inicial</p>
                  <p className="font-medium">
                    {formatDate(selectedVacation.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data Final</p>
                  <p className="font-medium">
                    {formatDate(selectedVacation.endDate)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Duração</p>
                <p className="font-medium">
                  {calculateDuration(
                    selectedVacation.startDate,
                    selectedVacation.endDate,
                  )}{" "}
                  dias
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Solicitado em</p>
                <p className="font-medium">
                  {formatDate(selectedVacation.createdAt)}
                </p>
              </div>

              {selectedVacation.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Observações</p>
                  <p className="mt-1 rounded-md bg-secondary p-2">
                    {selectedVacation.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setDetailsDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

VacationApprovalFlow.displayName = "VacationApprovalFlow";

export default VacationApprovalFlow;
