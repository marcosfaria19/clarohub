import React from "react";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import { cn } from "modules/shared/lib/utils";

const ProjectsSidebar = ({
  projects,
  loading,
  selectedProject,
  onSelectProject,
}) => {
  return (
    <div className="flex w-64 flex-col rounded-lg border border-border bg-card p-4">
      <h3 className="mb-4 text-lg font-semibold text-card-foreground">
        Projetos
      </h3>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {loading
            ? [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded bg-muted"
                ></div>
              ))
            : projects.map((project) => (
                <div
                  key={project._id}
                  className={cn(
                    "cursor-pointer rounded-lg bg-background p-3 transition-colors",
                    selectedProject?._id === project._id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary",
                  )}
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
      </ScrollArea>

      {/* <Button variant="outline" className="mt-4" onClick={onAddProject}>
        <PlusIcon className="mr-2 h-4 w-4" /> Novo Projeto
      </Button> */}
    </div>
  );
};

export default ProjectsSidebar;
