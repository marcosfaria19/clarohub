import { Users } from "lucide-react";
import { Input } from "modules/shared/components/ui/input";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import DraggableMember from "./DraggableMember";

const TeamPanel = ({ members, searchQuery, onSearchChange, demands }) => {
  return (
    <div className="bg-menu-500 flex w-80 flex-col rounded-tr-lg">
      <div className="ml-2 space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-card-foreground">Equipe</h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{members.length}</span>
          </div>
        </div>

        <Input
          placeholder="Buscar colaborador..."
          value={searchQuery}
          onChange={onSearchChange}
          className="bg-input text-foreground"
          maxLength={30}
        />

        <ScrollArea className="h-[calc(100vh-400px)]">
          <div className="space-y-2 pr-3">
            {members.map((member) => (
              <DraggableMember
                key={member.id}
                member={member}
                assignedCount={demands.reduce(
                  (count, demand) =>
                    count +
                    demand.assigned.filter((id) => id === member.id).length,
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
