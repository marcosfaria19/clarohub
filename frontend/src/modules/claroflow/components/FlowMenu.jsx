import React from "react";
import { HouseIcon } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "modules/shared/components/ui/tooltip";

export default function FlowMenu({ assignments = [], activeTab, onTabChange }) {
  return (
    <div className="relative bottom-0 z-20 flex w-auto items-center justify-start overflow-x-auto rounded-none sm:mt-12 lg:mt-0">
      <TooltipProvider>
        {/* Aba Home permanente */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`text-board-foreground/80 relative w-14 min-w-[50px] rounded-none rounded-t-[20px] bg-board ${
                activeTab === "home" ? "bg-primary text-accent-foreground" : ""
              }`}
              onClick={() => onTabChange("home")}
            >
              <HouseIcon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Página Inicial</TooltipContent>
        </Tooltip>

        {/* Abas de demandas */}
        {assignments.map((assignment) => (
          <Button
            key={assignment._id}
            variant="ghost"
            className={`text-board-foreground/80 h-10 w-[100px] rounded-none rounded-t-[20px] bg-board py-2 text-sm font-medium transition-colors ${
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
