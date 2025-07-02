import { Handle } from "reactflow";
import { Card, CardHeader, CardTitle } from "modules/shared/components/ui/card";
import { Button } from "modules/shared/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

const AssignmentNode = ({ data, selected }) => {
  return (
    <>
      <Handle type="target" position="left" />

      <Card
        className={`w-64 border-input bg-secondary/80 shadow-sm transition-all hover:opacity-90 ${
          selected ? "ring-2 ring-primary" : ""
        }`}
      >
        <CardHeader className="mx-2 p-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="line-clamp-1 text-base font-medium">
              {data.name}
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                onClick={data.onEdit}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive/80"
                onClick={data.onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Handle type="source" position="right" />
    </>
  );
};

export default AssignmentNode;
