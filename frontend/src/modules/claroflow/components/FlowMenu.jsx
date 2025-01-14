import React from "react";
import {
  HouseIcon,
  CalendarDaysIcon,
  ChartColumnIcon,
  SlidersHorizontalIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "modules/shared/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "modules/shared/components/ui/tooltip";

export default function FlowMenu() {
  return (
    <>
      <div className="relative bottom-0 z-20 flex w-auto justify-end space-x-2 justify-self-end rounded-tl-[20px] bg-board-title sm:mt-12 lg:mt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <HouseIcon className="h-5 w-5 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Página Inicial</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <CalendarDaysIcon className="h-5 w-5 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Calendário</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <ChartColumnIcon className="h-5 w-5 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Gráfico</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <SlidersHorizontalIcon className="h-5 w-5 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Filtro</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <UsersIcon className="h-5 w-5 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Equipe</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
}
