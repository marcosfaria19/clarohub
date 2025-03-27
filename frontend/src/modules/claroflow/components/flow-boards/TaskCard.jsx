import React from "react";
import { Card } from "modules/shared/components/ui/card";
import { Button } from "modules/shared/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "modules/shared/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export const TaskCard = ({ task, readonly }) => {
  return (
    <Card className="bg-card p-4">
      <div className="mb-2 flex items-start justify-between">
        {!readonly && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Mover para Análise</DropdownMenuItem>
              <DropdownMenuItem>Mover para Projeto</DropdownMenuItem>
              <DropdownMenuItem>Mover para Estruturado</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="mt-2 border-t pt-2">
        <p className="text-xs text-muted-foreground">
          Criado por: ABC em 25/03/2025
        </p>
        <div className="mt-1 space-y-1">
          {task.history.map((entry, index) => (
            <div key={index} className="text-xs text-muted-foreground">
              27/03/2025 - Analise - Marcos
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
