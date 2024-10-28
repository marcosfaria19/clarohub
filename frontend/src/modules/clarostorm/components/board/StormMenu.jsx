import React, { useState, useContext } from "react";
import { ThumbsUp, Trophy, SlidersHorizontal, Settings } from "lucide-react";
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

export default function StormMenu({ onToggleView }) {
  const [showRankingModal, setShowRankingModal] = useState(false);
  const { user } = useContext(AuthContext);
  const { remainingLikes } = useDailyLikes(user.userId);

  // Verifica se o usuário tem permissões de manager ou admin para visualizar a tabela
  const canToggleView =
    user.permissoes === "manager" || user.permissoes === "admin";

  return (
    <>
      <div className="flex justify-end space-x-2 sm:mx-10 sm:mt-24 lg:mx-10 lg:mt-0">
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

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => {}}>
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Filtrar</TooltipContent>
          </Tooltip>

          {/* Renderize o botão onToggleView somente se o usuário tiver permissões  */}
          {canToggleView && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onToggleView}>
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Gestão</TooltipContent>
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
