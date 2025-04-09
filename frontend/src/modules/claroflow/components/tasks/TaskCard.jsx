import React, { useState } from "react";
import { Button } from "modules/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";

import axiosInstance from "services/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function TaskCard({ task, isCompleted, onTransition, user }) {
  const [transitionLoading, setTransitionLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handler para transição de status
   */
  const handleTransition = async (newStatusId) => {
    setTransitionLoading(true);
    try {
      await axiosInstance.patch(`/flow/tasks/transition/${task._id}`, {
        newStatusId,
        obs: "Status alterado pelo usuário",
      });
      onTransition?.();
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setTransitionLoading(false);
    }
  };

  /**
   * Formata data para exibição
   */
  const formatDate = (date) =>
    format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });

  return (
    <Card className="group rounded-lg border-border bg-background shadow-sm transition-all hover:bg-accent/40 hover:opacity-80">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base font-semibold">
          <span>#{task.IDDEMANDA}</span>
          {isCompleted && (
            <span className="text-sm text-muted-foreground">
              {formatDate(task.history[0]?.finishedAt)}
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTransition("NOVO_STATUS_ID")}
              disabled={transitionLoading}
            >
              {transitionLoading ? "Processando..." : "Marcar como Concluído"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
