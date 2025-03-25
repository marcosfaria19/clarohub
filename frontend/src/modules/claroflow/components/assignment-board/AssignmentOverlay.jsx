import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "modules/shared/components/ui/avatar";
import { Card } from "modules/shared/components/ui/card";

const AssignmentOverlay = ({ activeMember }) => {
  if (!activeMember) return null;

  return (
    <Card className="w-[300px] cursor-grabbing bg-background shadow-lg">
      <div className="flex items-center gap-3 p-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={activeMember.avatar} />
          <AvatarFallback className="bg-card text-accent">
            {activeMember.name[0]}
          </AvatarFallback>
        </Avatar>
        <p className="font-medium text-popover-foreground">
          {activeMember.name}
        </p>
      </div>
    </Card>
  );
};

export default AssignmentOverlay;
