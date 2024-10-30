import React, { useState, useContext } from "react";
import {
  ThumbsUp,
  Trophy,
  SlidersHorizontal,
  ArrowDownToLine,
} from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import RankingModal from "../rankings/RankingModal";
import { AuthContext } from "contexts/AuthContext";
import { useDailyLikes } from "modules/clarostorm/hooks/useDailyLikes";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "modules/shared/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "modules/shared/components/ui/dropdown-menu";

export default function StormMenu({
  onToggleView,
  onFilterChange,
  currentFilter,
}) {
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [isManagerialView, setIsManagerialView] = useState(false);
  const { user } = useContext(AuthContext);
  const { remainingLikes } = useDailyLikes(user.userId);

  const canToggleView =
    user.permissoes === "manager" || user.permissoes === "admin";

  // Alterna o modo de visão e executa a função de toggle recebida
  const handleToggleView = () => {
    setIsManagerialView(!isManagerialView);
    onToggleView();
  };

  const handleFilterChange = (filter) => {
    onFilterChange(filter);
  };

  return (
    <>
      <div className="relative z-50 flex w-1/2 justify-end space-x-2 justify-self-end sm:mr-10 sm:mt-24 lg:mr-10 lg:mt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ThumbsUp className="h-5 w-5" />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {remainingLikes}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Curtidas Restantes</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowRankingModal(true)}
              >
                <Trophy className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ver Ranking</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Filtrar</TooltipContent>
            </Tooltip>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar</DropdownMenuLabel>
              {!isManagerialView && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("emAnalise")}
                    className={currentFilter === "emAnalise" ? "bg-accent" : ""}
                  >
                    Em Análise
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("aprovados")}
                    className={currentFilter === "aprovados" ? "bg-accent" : ""}
                  >
                    Aprovadas
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("arquivados")}
                    className={
                      currentFilter === "arquivados" ? "bg-accent" : ""
                    }
                  >
                    Arquivadas
                  </DropdownMenuItem>
                </>
              )}
              {canToggleView && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleToggleView}>
                    {isManagerialView ? "Visão Gerencial" : "Quadro de Ideias"}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {canToggleView && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleToggleView}>
                  <ArrowDownToLine className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Baixar Relatório</TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>

      <RankingModal
        isOpen={showRankingModal}
        onClose={() => setShowRankingModal(false)}
        userId={user.userId}
      />
    </>
  );
}
