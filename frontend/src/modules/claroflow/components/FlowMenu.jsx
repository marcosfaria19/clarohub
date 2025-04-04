import React from "react";
import { HouseIcon } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "modules/shared/components/ui/tooltip";

export default function FlowMenu({
  assignments = [],
  activeTab,
  onTabChange,
  role,
}) {
  return (
    <div className="relative bottom-0 z-20 flex w-auto items-center justify-start overflow-x-auto rounded-none drop-shadow-[0_0px_5px_rgba(0,0,0,0.25)] sm:mt-12 lg:mt-0">
      <TooltipProvider>
        {/* Aba Home permanente */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`relative w-14 min-w-[50px] rounded-none rounded-t-[20px] bg-secondary text-secondary-foreground/80 ${
                activeTab === "home" ? "bg-primary text-accent-foreground" : ""
              }`}
              onClick={() => onTabChange("home")}
            >
              <HouseIcon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Página Inicial</TooltipContent>
        </Tooltip>

        {/* Aba Equipe */}
        {(role === "manager" || role === "admin") && (
          <Button
            variant="ghost"
            className={`h-10 w-[100px] rounded-none rounded-t-[20px] bg-secondary py-2 text-sm font-medium text-secondary-foreground/80 transition-colors ${
              activeTab === "equipe" ? "bg-primary text-accent-foreground" : ""
            }`}
            onClick={() => onTabChange("equipe")}
          >
            Equipe
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
                className={`h-10 min-w-[100px] rounded-none rounded-t-[20px] bg-secondary py-2 text-sm font-medium text-secondary-foreground/80 transition-colors ${
                  activeTab === assignment._id
                    ? "bg-primary text-accent-foreground"
                    : ""
                }`}
                onClick={() => onTabChange(assignment._id)}
              >
                {assignment.name}
              </Button>
            ))}
      </TooltipProvider>
    </div>
  );
}
