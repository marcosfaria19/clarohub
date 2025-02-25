import React from "react";
import { Card } from "modules/shared/components/ui/card";
import { getCardComponent } from "../../utils/cardRegistry";

export const TaskCard = ({ task, projectType, assignmentName }) => {
  const CardComponent = getCardComponent(projectType, assignmentName);

  return (
    <Card className="min-h-28 rounded-lg border-none bg-card p-4 transition-shadow hover:shadow-md">
      <CardComponent task={task} />
    </Card>
  );
};
