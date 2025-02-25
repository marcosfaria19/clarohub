import React from "react";
import { Card } from "modules/shared/components/ui/card";
import { Button } from "modules/shared/components/ui/button";
import { getCardComponent } from "../../utils/cardRegistry";
import { DemandService } from "../../utils/demandService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "modules/shared/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export const TaskCard = ({
  task,
  projectType,
  assignmentName,
  readonly,
  onStatusChange,
}) => {
  const CardComponent = getCardComponent(projectType, assignmentName);
  const [statusHistory, setStatusHistory] = React.useState([]);

  const handleStatusChange = async (newStatusId) => {
    try {
      await DemandService.updateTaskStatus(
        task._id,
        newStatusId,
        "Status alterado",
      );
      onStatusChange?.();
    } catch (error) {
      console.error("Erro ao mudar status:", error);
    }
  };

  return (
    <Card className="bg-card p-4">
      <div className="mb-2 flex items-start justify-between">
        <CardComponent task={task} />

        {!readonly && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleStatusChange("67bcca7ea3ef98d341d7bca1")}
              >
                Mover para Análise
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("67bcca82a3ef98d341d7bca2")}
              >
                Mover para Projeto
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("67bcca8aa3ef98d341d7bca3")}
              >
                Mover para Estruturado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="mt-2 border-t pt-2">
        <p className="text-xs text-muted-foreground">
          Criado por: {task.createdBy.nome} em{" "}
          {new Date(task.insertedAt).toLocaleDateString()}
        </p>
        <div className="mt-1 space-y-1">
          {task.history.map((entry, index) => (
            <div key={index} className="text-xs text-muted-foreground">
              {new Date(entry.changedAt).toLocaleDateString()} -{" "}
              {entry.newStatus.name} ({entry.user.nome})
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
