import React from "react";
import { GitBranch, Home, Users } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";

export default function FlowMenu({
  assignments = [],
  activeTab,
  onTabChange,
  role,
  projects = [],
  additionalRoles = [],
}) {
  const isSupervisor = additionalRoles.includes("supervisor");
  const isManager = role.includes("manager");
  const isAdmin = role.includes("admin");

  return (
    <div className="relative bottom-0 z-10 flex w-auto items-center justify-start overflow-x-auto rounded-none drop-shadow-[0_0px_5px_rgba(0,0,0,0.25)] sm:mt-12 lg:mt-0">
      {/* Aba Home permanente */}

      <Button
        variant="ghost"
        size="icon"
        className={`relative w-14 min-w-[50px] rounded-none rounded-t-[20px] bg-secondary text-secondary-foreground/80 focus:opacity-80 focus-visible:ring-0 ${
          activeTab === "home" ? "bg-primary text-accent-foreground" : ""
        }`}
        onClick={() => onTabChange("home")}
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Página Inicial</span>
      </Button>

      {/* Aba Equipe para cada projeto (supervisor) */}
      {isSupervisor &&
        projects.map((project) => (
          <Button
            key={`team-${project._id}`}
            variant="ghost"
            className={`h-10 w-auto rounded-none rounded-t-[20px] bg-secondary py-2 text-sm font-medium text-secondary-foreground/80 transition-colors focus:opacity-80 focus-visible:ring-0 ${activeTab === `team-${project._id}` ? "bg-primary text-accent-foreground" : ""}`}
            onClick={() => onTabChange(`team-${project._id}`)}
          >
            <Users className="mr-2 h-4 w-4" />
            Equipe {project.name}
          </Button>
        ))}

      {/* Aba Equipe */}
      {!isSupervisor && (isManager || isAdmin) && (
        <Button
          variant="ghost"
          className={`h-10 w-[100px] rounded-none rounded-t-[20px] bg-secondary py-2 text-sm font-medium text-secondary-foreground/80 transition-colors focus:opacity-80 focus-visible:ring-0 ${
            activeTab === "team" ? "bg-primary text-accent-foreground" : ""
          }`}
          onClick={() => onTabChange("team")}
        >
          <Users className="mr-2 h-4 w-4" />
          Equipe
        </Button>
      )}

      {/* Aba Fluxo do Projeto */}
      {isAdmin && (
        <Button
          variant="ghost"
          className={`h-10 min-w-[100px] rounded-none rounded-t-[20px] bg-secondary py-2 text-sm font-medium text-secondary-foreground/80 transition-colors focus:opacity-80 focus-visible:ring-0 ${
            activeTab === "projectflow"
              ? "bg-primary text-accent-foreground"
              : ""
          }`}
          onClick={() => onTabChange("projectflow")}
        >
          <GitBranch className="mr-2 h-4 w-4" />
          Fluxos
        </Button>
      )}

      {/* Abas de demandas */}
      {assignments?.length > 0 &&
        assignments
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((assignment) => (
            <Button
              key={assignment._id}
              variant="ghost"
              className={`h-10 min-w-[100px] rounded-none rounded-t-[20px] bg-secondary py-2 text-sm font-medium text-secondary-foreground/80 transition-colors focus:opacity-80 focus-visible:ring-0 ${
                activeTab === assignment._id
                  ? "bg-primary text-accent-foreground"
                  : ""
              }`}
              onClick={() => onTabChange(assignment._id)}
            >
              {assignment.name}
            </Button>
          ))}
    </div>
  );
}
