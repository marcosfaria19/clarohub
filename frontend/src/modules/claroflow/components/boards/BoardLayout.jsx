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
import { TaskCard } from "../cards/TaskCard";
import LoadingSpinner from "modules/clarospark/components/LoadingSpinner";

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

  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (!project || !assignmentId) return;

        const [queueTasks, finished] = await Promise.all([
          DemandService.fetchTasks(project._id, assignmentId),
          DemandService.fetchFinishedTasks(project._id, assignmentId),
        ]);

        setTasks(queueTasks);
        setFinishedTasks(finished);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar tarefas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [project, assignmentId]);

  const handleTreat = async () => {
    try {
      const task = await DemandService.handleTreat(project._id, assignmentId);
      setInProgress((prev) => [...prev, task]);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (err) {
      setError("Erro ao processar tarefa");
      console.error(err);
    }
  };

  const filteredFinishedTasks = finishedTasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="mx-6 flex h-full flex-col gap-12 pt-6 md:flex-row md:flex-wrap">
      {/* Fila de Tarefas */}
      <div className="flex w-full flex-col gap-8 md:w-[300px]">
        <Card className="flex flex-col justify-between border-none bg-secondary text-card-foreground">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg">
              Fila de {assignment?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-3xl">
            <span>{tasks.length}</span>
            <Button
              variant="primary"
              size="sm"
              onClick={handleTreat}
              disabled={tasks.length === 0}
            >
              Tratar →
            </Button>
          </CardContent>
        </Card>

        {/* Time */}
        <Card className="h-full border-none bg-secondary text-card-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="mb-4 text-lg">Meu Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {teamMembers.map((user, index) => (
              <Card
                key={user._id}
                className="flex items-center gap-3 border-none p-2 shadow-md"
              >
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={user.avatar} alt={user.NOME} />
                  <AvatarFallback>
                    {user.NOME.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.NOME}</span>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Em Tratamento */}
      <div className="flex min-w-0 flex-1 flex-col space-y-4">
        <Card className="rounded-lg border-none bg-secondary text-card-foreground">
          <CardHeader className="h-12 p-3">
            <CardTitle className="text-lg">Em Tratamento</CardTitle>
          </CardHeader>
        </Card>
        <Card className="flex-1 border-none bg-secondary text-card-foreground">
          <CardContent className="h-full p-4">
            <div className="h-full space-y-4 rounded-lg p-2">
              {inProgress.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  projectType={project?.name}
                  assignmentName={assignment?.name}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Finalizadas */}
      <div className="flex min-w-0 flex-1 flex-col space-y-4">
        <Card className="border-none bg-secondary text-card-foreground">
          <CardHeader className="h-12 p-3">
            <CardTitle className="flex h-8 items-start justify-between text-lg">
              Finalizadas
              <div className="relative bottom-[7px] w-3/5">
                <Input
                  placeholder="Buscar finalizadas..."
                  className="w-full border-none bg-card pl-4 pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
        <ScrollArea className="max-h-[550px]">
          <Card className="flex-1 border-none bg-secondary text-card-foreground">
            <CardContent className="h-full p-4">
              <div className="h-full space-y-4 rounded-lg p-2">
                {filteredFinishedTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    projectType={project?.name}
                    assignmentName={assignment?.name}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollArea>
      </div>
    </div>
  );
}
