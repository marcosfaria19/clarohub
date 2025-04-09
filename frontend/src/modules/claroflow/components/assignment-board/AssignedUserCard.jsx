import { useState } from "react";
import RegionalSelector from "./RegionalSelector";

const { Settings, X } = require("lucide-react");
const {
  Avatar,
  AvatarImage,
  AvatarFallback,
} = require("modules/shared/components/ui/avatar");
const { Badge } = require("modules/shared/components/ui/badge");
const { Button } = require("modules/shared/components/ui/button");
const { Card } = require("modules/shared/components/ui/card");
const {
  Popover,
  PopoverTrigger,
  PopoverContent,
} = require("modules/shared/components/ui/popover");

/**
 * AssignedUserCard
 * Componente que renderiza o cartão do usuário atribuído à demanda.
 *
 * Props:
 * - assignment: Objeto contendo os dados da assignment (userId e regionals).
 * - member: Objeto com os dados do usuário (nome, avatar, id).
 * - onUnassign: Função para desatribuir o usuário da demanda.
 * - onUpdateRegional: Função para atualizar as regionals do usuário.
 * - assignmentId: ID da demanda (usado para identificar a coluna).
 */
const AssignedUserCard = ({
  assignment,
  member,
  assignmentId,
  onUnassign,
  onUpdateRegional,
}) => {
  // Handler para atualizar as regionals do usuário
  const handleRegionalChange = (regionals) => {
    onUpdateRegional(assignmentId, member.id, regionals);
  };
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Card className="bg-background p-2 shadow-sm">
      <div className="flex items-center gap-2">
        {/* Exibição do avatar do usuário */}
        <Avatar className="h-10 w-10">
          <AvatarImage src={member?.avatar} alt={member?.name} />
          <AvatarFallback className="bg-card text-accent">
            {member?.name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-card-foreground">
            {member?.name}
          </span>
          {/* Exibe as regionals, se houver */}
          {assignment.regionals && (
            <div className="flex gap-1">
              {assignment.regionals.primary && (
                <Badge variant="basic">{assignment.regionals.primary}</Badge>
              )}
              {assignment.regionals.secondary && (
                <Badge variant="basic" className="bg-accent/60">
                  {assignment.regionals.secondary}
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="ml-auto flex items-center justify-end gap-2">
          {/* Popover para alterar as regionals */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger>
              <Settings className="h-3.5 w-3.5" />
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <RegionalSelector
                initialPrimary={assignment.regionals?.primary}
                initialSecondary={assignment.regionals?.secondary}
                onSave={handleRegionalChange}
                onClose={() => setIsPopoverOpen(false)}
              />
            </PopoverContent>
          </Popover>
          {/* Botão para desatribuir o usuário da demanda */}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={() => onUnassign(member.id, assignmentId)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
export default AssignedUserCard;
