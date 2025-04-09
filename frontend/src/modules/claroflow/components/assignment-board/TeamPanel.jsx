import { Users } from "lucide-react";
import { Input } from "modules/shared/components/ui/input";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import DraggableMember from "./DraggableMember";

const TeamPanel = ({
  members,
  searchQuery,
  onSearchChange,
  assignments,
  className,
}) => {
  return (
    <div className={`w-full bg-background p-4 md:w-[350px] ${className}`}>
      <div className="flex h-full flex-col space-y-4 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">Equipe</h3>
          <div className="text-md flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{members.length}</span>
          </div>
        </div>

        <Input
          placeholder="Buscar colaborador..."
          value={searchQuery}
          onChange={onSearchChange}
          className="bg-background"
          maxLength={30}
        />

        <ScrollArea className="flex-1 overflow-auto">
          <div className="space-y-2 pr-2">
            {members.map((member) => (
              <DraggableMember
                key={member.id}
                member={member}
                assignedCount={assignments.reduce(
                  (count, assignment) =>
                    count +
                    assignment.assigned.filter(
                      (assignment) => assignment.userId === member.id,
                    ).length,
                  0,
                )}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TeamPanel;
