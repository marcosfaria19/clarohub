import React, { useEffect, useState } from "react";
import { Button } from "modules/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import { Input } from "modules/shared/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "modules/shared/components/ui/avatar";
import { SearchIcon } from "lucide-react";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import { useUsers } from "../../hooks/useUsers";
import { DemandService } from "../../utils/demandService";

import { Skeleton } from "modules/shared/components/ui/skeleton";
import { TaskCard } from "../cards/TaskCard";

export default function BoardLayout({ assignmentId, project, assignment }) {
  const { getUsersByProjectAndAssignment } = useUsers();
  const [tasks, setTasks] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const teamMembers = getUsersByProjectAndAssignment(
    project?._id,
    assignmentId,
  );

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const [queueTasks, finished] = await Promise.all([
        DemandService.fetchTasks(project._id, assignmentId),
        DemandService.fetchFinishedTasks(project._id, assignmentId),
      ]);

      setTasks(queueTasks);
      setFinishedTasks(finished);
    } catch (err) {
      setError("Falha ao carregar tarefas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTreat = async () => {
    try {
      const task = await DemandService.handleTreat(project._id, assignmentId);

      setInProgress((prev) => [...prev, task]);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (err) {
      setError("Falha ao processar tarefa");
      console.error(err);
    }
  };

  useEffect(() => {
    if (project && assignmentId) {
      loadTasks();
    }
  }, [project, assignmentId]);

  const filteredFinishedTasks = finishedTasks.filter(
    (task) =>
      task.IDDEMANDA.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.ENDERECO_VISTORIA.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="mx-6 space-y-4 pt-6">
        <Skeleton className="h-[100px] w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-[400px] w-[300px]" />
          <Skeleton className="h-[400px] flex-1" />
          <Skeleton className="h-[400px] flex-1" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-6 pt-6 text-red-500">
        {error} -{" "}
        <button onClick={loadTasks} className="text-blue-500">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="mx-6 flex h-full flex-col gap-12 pt-6 md:flex-row md:flex-wrap">
      {/* Coluna Fila */}
      <div className="flex w-full flex-col gap-8 md:w-[300px]">
        <Card className="bg-secondary">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg">
              Fila de {assignment?.name}
              <span className="mt-2 block text-2xl font-bold">
                {tasks.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="primary"
              className="w-full"
              onClick={handleTreat}
              disabled={tasks.length === 0}
            >
              Tratar Próxima Task
            </Button>
          </CardContent>
        </Card>

        {/* Time */}
        <Card className="bg-secondary">
          <CardHeader>
            <CardTitle className="text-lg">Membros do Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member._id}
                className="flex items-center gap-3 rounded bg-card p-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>
                    {member.nome
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{member.nome}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Coluna Em Tratamento */}
      <div className="flex-1 space-y-4">
        <Card className="bg-secondary">
          <CardHeader className="p-3">
            <CardTitle className="text-lg">
              Em Tratamento ({inProgress.length})
            </CardTitle>
          </CardHeader>
        </Card>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {inProgress.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                projectType={project.name}
                assignmentName={assignment.name}
                onStatusChange={loadTasks}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Coluna Finalizadas */}
      <div className="flex-1 space-y-4">
        <Card className="bg-secondary">
          <CardHeader className="p-3">
            <CardTitle className="text-lg">
              Finalizadas ({filteredFinishedTasks.length})
            </CardTitle>
            <div className="relative">
              <Input
                placeholder="Buscar..."
                className="bg-card pl-4 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
        </Card>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {filteredFinishedTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                projectType={project.name}
                assignmentName={assignment.name}
                readonly
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
