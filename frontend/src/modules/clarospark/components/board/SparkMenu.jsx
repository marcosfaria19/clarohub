import React, { useState, useContext, useEffect } from "react";
import {
  ThumbsUp,
  Trophy,
  SlidersHorizontal,
  ArrowDownToLine,
  Check,
} from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import RankingModal from "../rankings/RankingModal";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useDailyLikes } from "modules/clarospark/hooks/useDailyLikes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "modules/shared/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "modules/shared/components/ui/dropdown-menu";
import { useDownloadIdeas } from "modules/clarospark/hooks/useDownloadIdeas";

export default function SparkMenu({
  onToggleView,
  onFilterChange,
  currentFilter,
}) {
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [isManagerialView, setIsManagerialView] = useState(false);
  const { user } = useContext(AuthContext);
  const { remainingLikes, fetchRemainingLikes } = useDailyLikes(user.userId);
  const { downloadIdeas, isDownloading, error } = useDownloadIdeas();

  const canToggleView =
    user.permissoes === "manager" || user.permissoes === "admin";

  const handleToggleView = () => {
    setIsManagerialView(!isManagerialView);
    onToggleView();
  };

  const handleFilterChange = (filter) => {
    onFilterChange(filter);
  };

  const handleDownload = async () => {
    await downloadIdeas();
    if (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRemainingLikes();
  });

  return (
    <>
      <div className="relative bottom-0 top-[5px] z-20 flex w-1/2 justify-end space-x-2 justify-self-end sm:mr-10 sm:mt-24 lg:mr-10 lg:mt-0">
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

            <DropdownMenuContent align="end" className="select-none">
              <DropdownMenuLabel>Filtrar</DropdownMenuLabel>
              {!isManagerialView && (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => handleFilterChange("emAnalise")}
                    className={`flex justify-between ${currentFilter === "emAnalise" ? "bg-accent text-accent-foreground" : ""}`}
                  >
                    Em Análise
                    {currentFilter === "emAnalise" && (
                      <Check className="h-4 w-4 text-primary-foreground" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("aprovados")}
                    className={`flex justify-between ${currentFilter === "aprovados" ? "bg-accent text-accent-foreground" : ""}`}
                  >
                    Aprovadas
                    {currentFilter === "aprovados" && (
                      <Check className="h-4 w-4 text-primary-foreground" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("arquivados")}
                    className={`flex justify-between ${currentFilter === "arquivados" ? "bg-accent text-accent-foreground" : ""}`}
                  >
                    Arquivadas
                    {currentFilter === "arquivados" && (
                      <Check className="h-4 w-4 text-primary-foreground" />
                    )}
                  </DropdownMenuItem>
                </>
              )}
              {canToggleView && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleToggleView}>
                    {!isManagerialView ? "Visão Gerencial" : "Quadro de Ideias"}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {canToggleView && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  <ArrowDownToLine className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isDownloading ? "Baixando..." : "Baixar Relatório"}
              </TooltipContent>
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
