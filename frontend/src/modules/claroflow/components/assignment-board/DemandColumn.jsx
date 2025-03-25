import { useDroppable } from "@dnd-kit/core";
import { Users, X } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "modules/shared/components/ui/avatar";
import { Button } from "modules/shared/components/ui/button";
import { Card } from "modules/shared/components/ui/card";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";

const DemandColumn = ({ demand, members, onUnassign }) => {
  const { setNodeRef, isOver } = useDroppable({ id: demand.id });

  return (
    <Card className="flex h-[calc(100vh-250px)] min-w-72 flex-1 flex-col border-none bg-secondary">
      <div className="rounded-t-lg bg-card p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-card-foreground">{demand.name}</h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{demand.assigned.length}</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div
          ref={setNodeRef}
          className={`h-full space-y-2 rounded-lg ${isOver ? "bg-accent/20" : ""}`}
        >
          {demand.assigned.map((memberId) => {
            const member = members.find((m) => m.id === memberId);
            return (
              <Card key={memberId} className="bg-background p-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member?.avatar} alt={member?.name} />
                    <AvatarFallback className="bg-card text-accent">
                      {member?.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-card-foreground">
                    {member?.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto text-card-foreground/40 hover:text-destructive"
                    onClick={() => onUnassign(member.id, demand.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            );
          })}

          {demand.assigned.length === 0 && (
            <div className="mt-2 flex h-12 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 text-muted-foreground">
              Arraste aqui
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default DemandColumn;
