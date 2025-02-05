import React, { useState } from "react";
import { HouseIcon } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "modules/shared/components/ui/tooltip";

export default function FlowMenu({ assignments = [] }) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="relative bottom-0 z-20 flex w-auto items-center justify-start rounded-none sm:mt-12 lg:mt-0">
      <TooltipProvider>
        {/* Aba Home permanente */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`relative w-14 rounded-none rounded-t-[20px] bg-board text-accent-foreground/80 ${
                activeTab === "home" ? "bg-primary text-accent-foreground" : ""
              }`}
              onClick={() => setActiveTab("home")}
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
            className={`h-10 w-[100px] rounded-none rounded-t-[20px] py-2 text-sm font-medium transition-colors ${
              activeTab === assignment._id
                ? "bg-primary text-accent-foreground"
                : "bg-board text-accent-foreground/80"
            }`}
            onClick={() => setActiveTab(assignment._id)}
          >
            {assignment.name}
          </Button>
        ))}
      </TooltipProvider>
    </div>
  );
}
