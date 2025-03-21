import { useState, useEffect, useMemo, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { motion } from "framer-motion";
import { Users, X } from "lucide-react";

// Componentes
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "modules/shared/components/ui/avatar";
import { Input } from "modules/shared/components/ui/input";
import { Button } from "modules/shared/components/ui/button";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import { Card } from "modules/shared/components/ui/card";
import { useUsers } from "../hooks/useUsers";
import { formatUserName } from "modules/shared/utils/formatUsername";
import Container from "modules/shared/components/ui/container";

const initialDemands = [
  { id: "viabilidade", name: "Viabilidade", assigned: [] },
  { id: "Análise", name: "Análise", assigned: [] },
  { id: "Projetos", name: "Projeto", assigned: [] },
  { id: "Estruturado", name: "Estruturado", assigned: [] },
];

const DraggableMember = ({ member, assignedCount }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: member.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
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
        className="group touch-none bg-secondary p-3 transition-shadow hover:shadow-md"
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
            <p className="font-medium text-card-foreground">
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

const DemandColumn = ({ demand, members, onUnassign }) => {
  const { setNodeRef, isOver } = useDroppable({ id: demand.id });

  return (
    <Card className="flex h-[calc(100vh-180px)] min-w-72 flex-1 flex-col border-none bg-secondary">
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
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-card text-accent">
                      {member.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-card-foreground">
                    {member.name}
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

const AssignmentBoard = () => {
  const { users } = useUsers();
  const [demands, setDemands] = useState(initialDemands);
  const [activeId, setActiveId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const members = useMemo(
    () =>
      users.map((user) => ({
        ...user,
        id: user._id,
        name: formatUserName(user.NOME),
        avatar: user.avatar,
      })),
    [users],
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (over?.id && over.id !== active.id) {
      setDemands((prev) =>
        prev.map((demand) =>
          demand.id === over.id
            ? {
                ...demand,
                assigned: [...new Set([...demand.assigned, active.id])],
              }
            : demand,
        ),
      );
    }
    setActiveId(null);
  }, []);

  const handleUnassign = useCallback((memberId, demandId) => {
    setDemands((prev) =>
      prev.map((demand) =>
        demand.id === demandId
          ? {
              ...demand,
              assigned: demand.assigned.filter((id) => id !== memberId),
            }
          : demand,
      ),
    );
  }, []);

  const filteredMembers = useMemo(
    () =>
      members.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [members, searchQuery],
  );

  const activeMember = useMemo(
    () => members.find((m) => m.id === activeId),
    [members, activeId],
  );

  return (
    <Container innerClassName="mb-4 h-[calc(100vh-800px)] max-w-[95vw] bg-container">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={`flex h-full ${isMobile && "flex-col"}`}>
          {/* Team Panel */}
          <div
            className={`flex w-80 flex-col rounded-t-lg bg-menu ${isMobile && "w-full"}`}
          >
            <div className="ml-2 space-y-4 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-card-foreground">Equipe</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{filteredMembers.length}</span>
                </div>
              </div>

              <Input
                placeholder="Buscar colaborador..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-input text-foreground"
              />

              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-2 pr-3">
                  {filteredMembers.map((member) => (
                    <DraggableMember
                      key={member.id}
                      member={member}
                      assignedCount={demands.reduce(
                        (count, demand) =>
                          count +
                          demand.assigned.filter((id) => id === member.id)
                            .length,
                        0,
                      )}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Demands Board */}
          <div className="flex flex-1 flex-col overflow-hidden bg-background pl-4">
            <div className={`flex gap-4 ${isMobile && "flex-col"}`}>
              {demands.map((demand) => (
                <DemandColumn
                  key={demand.id}
                  demand={demand}
                  members={members}
                  onUnassign={handleUnassign}
                />
              ))}
            </div>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeMember && (
              <Card className="cursor-grabbing bg-popover p-3 shadow-lg">
                <div className="flex items-center gap-3">
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
            )}
          </DragOverlay>
        </div>
      </DndContext>
    </Container>
  );
};

export default AssignmentBoard;
