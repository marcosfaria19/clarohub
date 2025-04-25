import React, { useContext, useState, useEffect } from "react";
import { Button } from "modules/shared/components/ui/button";
import { Badge } from "modules/shared/components/ui/badge";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "modules/shared/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "modules/shared/components/ui/dialog";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "modules/shared/components/ui/avatar";
import { Separator } from "modules/shared/components/ui/separator";
import { cn } from "modules/shared/lib/utils";
import formatUserName from "modules/shared/utils/formatUsername";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useLikes } from "modules/clarospark/hooks/useLikes";
import statusConfig from "modules/clarospark/utils/statusConfig";
import { getLikeIcon } from "modules/clarospark/utils/getLikeIcon";
import spark from "modules/clarospark/assets/f0.png";
import { useTheme } from "modules/shared/contexts/ThemeContext";
import { format } from "date-fns";
import { useIdeaIsNew } from "modules/clarospark/hooks/useIdeaIsNew";
import NewIndicator from "./IdeaNewIndicator";

export default function IdeaCard({
  title,
  description,
  creator,
  likesCount: initialLikesCount = 0,
  status,
  anonymous,
  ideaId,
  createdAt,
  history = [],
}) {
  const { user } = useContext(AuthContext);
  const { likesCount, handleLike, updateLikeCount } = useLikes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { color, icon } = statusConfig[status] || statusConfig["Em análise"];
  const { theme } = useTheme();

  // Hook para lógica de "Nova!"
  const { isNew, markAsViewed } = useIdeaIsNew(ideaId, createdAt);

  const handleCardClick = () => {
    setIsModalOpen(true);
    markAsViewed();
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const formattedCreatedAt = format(new Date(createdAt), "dd/MM/yyyy");

  const isLongDescription = description.length > 90;
  const truncatedDescription = isLongDescription
    ? `${description.substring(0, 90)} ... `
    : description;

  const displayedCreator =
    anonymous === 1 ? "Anônimo" : formatUserName(creator.name);

  const displayedAvatar =
    anonymous === 1 ? "/anonymous-avatar.png" : creator.avatar;

  useEffect(() => {
    updateLikeCount(ideaId, initialLikesCount);
  }, [ideaId, initialLikesCount, updateLikeCount]);

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    try {
      await handleLike(ideaId, user.userId);
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const currentLikes = likesCount[ideaId] || initialLikesCount;
  const likeIcon = getLikeIcon(currentLikes, theme);

  const lastChange = history.length > 0 ? history[history.length - 1] : null;
  const lastChangedBy = lastChange ? lastChange.changedBy : "";

  return (
    <TooltipProvider>
      <div
        className={`relative h-36 w-full max-w-md cursor-pointer rounded-lg bg-card-spark p-4 ${
          currentLikes > 99 ? "animate-shadow-pulse" : "border-0"
        } `}
        onClick={handleCardClick}
      >
        {/* Exibe o indicador "Nova!" se for uma ideia nova */}
        <NewIndicator isNew={isNew} />

        <h4 className="max-w-[250px] truncate text-sm font-semibold">
          {title}
        </h4>

        <p className="line-clamp-3 text-xs text-foreground">
          {truncatedDescription}
          {isLongDescription && <span className="underline">Leia mais</span>}
        </p>

        <div className="absolute bottom-3 left-4 flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src={displayedAvatar} alt={displayedCreator} />
            <AvatarFallback>{displayedCreator[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-2 flex max-w-[120px] flex-col">
            <span className="ml-1 truncate text-xs font-semibold">
              {displayedCreator}
            </span>
            <Badge className={cn("mt-1 w-fit text-[11px]", color)}>
              {icon} {status}
            </Badge>
          </div>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-1 right-1 p-1 text-foreground"
              onClick={status === "Em Análise" ? handleLikeClick : undefined}
              disabled={status !== "Em Análise"}
            >
              <img src={likeIcon} alt="Sparks" className="w-6" />
              <span className="relative bottom-4 right-1 text-xs">
                {currentLikes}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {status === "Em Análise" ? "Apoiar ideia" : "Like desativado"}
          </TooltipContent>
        </Tooltip>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card-spark sm:max-w-[550px]">
          <DialogHeader className="mb-2 p-0">
            <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
            <div className="mt-2 flex items-center space-x-2">
              <Badge className={cn("w-fit text-sm", color)}>
                {icon} {status}
              </Badge>
            </div>
            {lastChangedBy && (
              <span className="text-sm text-muted-foreground">
                Tratada por: {formatUserName(lastChangedBy)}
              </span>
            )}
          </DialogHeader>

          <ScrollArea className="max-h-[40dvh] pr-4">
            <div className="space-y-4">
              <p className="select-text text-sm text-foreground">
                {description}
              </p>
              <Separator />
              <div className="flex items-center justify-between"></div>
            </div>
          </ScrollArea>
          <DialogFooter className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={displayedAvatar} alt={displayedCreator} />
                <AvatarFallback>{displayedCreator[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  {displayedCreator}
                </p>
                <p className="text-xs text-muted-foreground">
                  Tive essa ideia dia {formattedCreatedAt}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentLikes} sparks
                </p>
              </div>
            </div>

            <div className="flex-grow" />

            <div className="flex space-x-2">
              {status === "Em Análise" && (
                <Button variant="primary" onClick={handleLikeClick}>
                  <img src={spark} alt="Sparks" className="mr-2 w-6" />
                  Apoiar
                </Button>
              )}
              <Button variant="secondary" onClick={handleCloseModal}>
                Fechar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
