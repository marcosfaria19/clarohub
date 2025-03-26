import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "modules/shared/components/ui/avatar";
import { Card } from "modules/shared/components/ui/card";
import { formatUserName } from "modules/shared/utils/formatUsername";

const DraggableMember = ({ member, assignedCount }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: member.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: 0,
      }
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-2"
    >
      <Card
        ref={setNodeRef}
        style={style}
        className="group m-1 touch-none bg-secondary p-3 outline-none transition-shadow hover:opacity-80 focus-visible:outline-1 focus-visible:outline-accent"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback className="bg-card text-accent">
              {member.name[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-1 flex-col">
            <p className="text-sm font-medium text-card-foreground">
              {formatUserName(member.name)}
            </p>
            <div className="flex gap-1.5">
              {Array.from({ length: assignedCount }).map((_, i) => (
                <div key={i} className="h-2 w-2 rounded-full bg-accent" />
              ))}
              {assignedCount === 0 && (
                <div className="h-2 w-2 rounded-full border border-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DraggableMember;
