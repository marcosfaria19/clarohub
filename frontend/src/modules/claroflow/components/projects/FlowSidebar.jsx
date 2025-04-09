// components/ProjectsSidebar.jsx
import React from "react";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import { Button } from "modules/shared/components/ui/button";
import { PlusIcon } from "lucide-react";

const ProjectsSidebar = ({
  projects,
  loading,
  selectedProject,
  onSelectProject,
}) => {
  return (
    <div className="flex w-64 flex-col p-4">
      <h3 className="mb-4 text-lg font-semibold">Projetos</h3>

      <ScrollArea className="flex-1">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded bg-muted"
              ></div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project._id}
                className={`cursor-pointer rounded-lg p-3 transition-colors ${
                  selectedProject?._id === project._id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
                onClick={() => onSelectProject(project)}
              >
                <div className="flex items-center justify-between">
                  <span>{project.name}</span>
                  <span className="rounded-full bg-background px-2 py-1 text-xs text-foreground">
                    {project.assignments?.length || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <Button
        variant="outline"
        className="mt-4"
        onClick={() => {
          // Lógica para adicionar novo projeto
        }}
      >
        <PlusIcon className="mr-2 h-4 w-4" /> Novo Projeto
      </Button>
    </div>
  );
};

export default ProjectsSidebar;
