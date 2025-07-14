import React, { useState, useContext } from "react";
import { Trophy, SlidersHorizontal, ArrowDownToLine } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import RankingModal from "../rankings/RankingModal";
import { AuthContext } from "modules/shared/contexts/AuthContext";
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
import spark from "modules/clarospark/assets/f0.png";
import sparkw from "modules/clarospark/assets/f0w.png";
import { useTheme } from "modules/shared/contexts/ThemeContext";
import { useSpark } from "modules/clarospark/hooks/sparkContext";

export default function SparkMenu({
  onToggleView,
  onFilterChange,
  currentFilter,
}) {
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [isManagerialView, setIsManagerialView] = useState(false);
  const { user } = useContext(AuthContext);

  const { remainingLikes, isLoading, error } = useSpark();

  const {
    downloadIdeas,
    isDownloading,
    error: downloadError,
  } = useDownloadIdeas();

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
    if (downloadError) {
      console.error(downloadError);
    }
  };

  const { theme } = useTheme();

  return (
    <>
      <div className="tour-sparkmenu relative bottom-0 top-[4px] z-20 flex w-auto justify-end space-x-2 justify-self-end sm:mr-10 sm:mt-24 lg:mr-10 lg:mt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <img
                  src={theme === "dark" ? spark : sparkw}
                  alt="Quantidade de Sparks"
                  width={22}
                  draggable={false}
                />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {isLoading ? "..." : remainingLikes}
                </span>
                {error && (
                  <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {error ? "Erro ao carregar sparks" : "Sparks Restantes"}
            </TooltipContent>
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
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("emAndamento")}
                    className={`flex justify-between ${currentFilter === "emAndamento" ? "bg-accent text-accent-foreground" : ""}`}
                  >
                    Em Andamento
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("aprovados")}
                    className={`flex justify-between ${currentFilter === "aprovados" ? "bg-accent text-accent-foreground" : ""}`}
                  >
                    Aprovadas
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("arquivados")}
                    className={`flex justify-between ${currentFilter === "arquivados" ? "bg-accent text-accent-foreground" : ""}`}
                  >
                    Arquivadas
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("minhasIdeias")}
                    className={`flex justify-between ${currentFilter === "minhasIdeias" ? "bg-accent text-accent-foreground" : ""}`}
                  >
                    Minhas ideias
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
