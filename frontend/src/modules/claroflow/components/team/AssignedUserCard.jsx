const { X } = require("lucide-react");
const {
  Avatar,
  AvatarImage,
  AvatarFallback,
} = require("modules/shared/components/ui/avatar");

const { Button } = require("modules/shared/components/ui/button");
const { Card } = require("modules/shared/components/ui/card");

const AssignedUserCard = ({ assignment, member, assignmentId, onUnassign }) => {
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
        </div>
        <div className="ml-auto flex items-center justify-end gap-2">
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
