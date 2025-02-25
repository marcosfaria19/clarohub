import React from "react";
import { Badge } from "modules/shared/components/ui/badge";

export const MDUAnaliseCard = ({ task }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="border-blue-200 text-blue-800">
          #{task.IDDEMANDA}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {task.COD_OPERADORA}
        </span>
      </div>

      <h3 className="font-medium">{task.ENDERECO_VISTORIA}</h3>

      <div className="flex items-center gap-2 text-xs">
        <Badge variant="secondary">Análise</Badge>
        <span className="text-muted-foreground">
          Prioridade: {task.priority || "Média"}
        </span>
      </div>
    </div>
  );
};
