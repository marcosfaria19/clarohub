import { useDroppable } from "@dnd-kit/core";
import { ChevronDown, Users, X } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "modules/shared/components/ui/avatar";
import { Button } from "modules/shared/components/ui/button";
import { Card } from "modules/shared/components/ui/card";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "modules/shared/components/ui/dropdown-menu";

const DemandColumn = ({ demand, members, onUnassign, onUpdateRegional }) => {
  const { setNodeRef, isOver } = useDroppable({ id: demand.id });

  const regionais = [
    "RSI",
    "RBS",
    "RRS",
    "RPS",
    "RSC",
    "RNO",
    "RCO",
    "RNE",
    "RRE",
    "RMG",
  ];

  return (
    <Card className="flex h-full min-w-72 flex-1 flex-col border border-border bg-card">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-card-foreground">
            {demand.name}
          </h3>
          <div className="text-md flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{demand.assigned.length}</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div
          ref={setNodeRef}
          className={`space-y-2 p-4 ${isOver ? "bg-accent/20" : ""}`}
        >
          {demand.assigned.map((memberId) => {
            const member = members.find((m) => m.id === memberId);
            const regional = member?.regional; // Assume que a regional está no membro

            return (
              <Card key={memberId} className="bg-background p-2 shadow-sm">
                <div className="flex items-center gap-2">
                  {/* Avatar - Mantido exatamente como estava */}
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member?.avatar} alt={member?.name} />
                    <AvatarFallback className="bg-secondary text-accent">
                      {member?.name[0]}
                    </AvatarFallback>
                  </Avatar>

                  {/* Nome - Mantido exatamente como estava */}
                  <span className="flex-1 text-sm font-medium text-card-foreground">
                    {member?.name}
                  </span>

                  {/* Nova implementação da Regional (sem quebrar o layout existente) */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-muted-foreground hover:bg-accent/10"
                      >
                        {regional || "Regional"}
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      {regionais.map((reg) => (
                        <DropdownMenuItem
                          key={reg}
                          onSelect={() =>
                            onUpdateRegional(memberId, demand.id, reg)
                          }
                        >
                          {reg}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Botão de remover - Mantido exatamente como estava */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => onUnassign(member.id, demand.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}

          {demand.assigned.length === 0 && (
            <div className="mt-2 flex h-12 items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground">
              Arraste aqui
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default DemandColumn;
