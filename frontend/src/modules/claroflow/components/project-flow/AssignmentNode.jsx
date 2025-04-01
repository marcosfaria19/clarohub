// components/AssignmentNode.jsx
import { Handle } from "reactflow";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "modules/shared/components/ui/card";
import { Button } from "modules/shared/components/ui/button";
import { Avatar, AvatarFallback } from "modules/shared/components/ui/avatar";
import { Edit2, Trash2 } from "lucide-react";

const AssignmentNode = ({ data, selected }) => {
  return (
    <>
      <Handle type="target" position="top" />

      <Card className={`w-64 ${selected ? "ring-2 ring-primary" : ""}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{data.name}</CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={data.onEdit}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={data.onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex -space-x-2">
            {data.assignedUsers?.slice(0, 5).map((user, index) => (
              <Avatar
                key={index}
                className="h-8 w-8 border-2 border-background"
              >
                <AvatarFallback className="text-xs">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            ))}
            {data.assignedUsers?.length > 5 && (
              <Avatar className="h-8 w-8 border-2 border-background">
                <AvatarFallback className="text-xs">
                  +{data.assignedUsers.length - 5}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </CardContent>
      </Card>

      <Handle type="source" position="bottom" />
    </>
  );
};

export default AssignmentNode;
