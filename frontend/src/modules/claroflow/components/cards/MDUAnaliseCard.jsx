import React from "react";

export const MDUAnaliseCard = ({ task }) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">{task.title}</h3>
      <p className="text-sm text-muted-foreground">{task.description}</p>
      <div className="flex items-center gap-2 text-xs">
        <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-800">
          MDU - Análise
        </span>
        <span className="text-orange-600">Prioridade: {task.priority}</span>
      </div>
    </div>
  );
};
