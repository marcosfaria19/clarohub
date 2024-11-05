import React, { useContext, useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";
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
import { useLikes } from "modules/clarostorm/hooks/useLikes";
import statusConfig from "modules/clarostorm/utils/statusConfig";

export default function IdeaCard({
  title,
  description,
  creator,
  likesCount: initialLikesCount = 0,
  status,
  anonymous,
  ideaId,
}) {
  const { user } = useContext(AuthContext);
  const { likesCount, handleLike, updateLikeCount } = useLikes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { color, icon } = statusConfig[status] || statusConfig["Em análise"];

  const handleCardClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const isLongDescription = description.length > 90;
  const truncatedDescription = isLongDescription
    ? `${description.substring(0, 85)} ... `
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

  return (
    <TooltipProvider>
      <div
        className="relative h-36 w-full cursor-pointer rounded-lg bg-card-storm p-4 shadow transition-shadow hover:shadow-md"
        onClick={handleCardClick}
      >
        <h4 className="max-w-[250px] truncate text-sm font-semibold">
          {title}
        </h4>

        <p className="line-clamp-3 text-xs text-foreground">
          {truncatedDescription}
          {isLongDescription && <span className="underline">Leia mais</span>}
        </p>

        <div className="absolute bottom-3 left-4 flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src={displayedAvatar} alt={displayedCreator} />{" "}
            {/* Usando o avatar do criador aqui */}
            <AvatarFallback>{displayedCreator[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-2 flex max-w-[120px] flex-col">
            <span className="ml-1 truncate text-xs font-semibold">
              {displayedCreator}
            </span>
            <Badge className={cn("mt-1 w-fit text-[10px]", color)}>
              {icon} {status}
            </Badge>
          </div>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-1 right-4 p-1 text-foreground"
              onClick={status === "Em Análise" ? handleLikeClick : undefined}
              disabled={status !== "Em Análise"}
            >
              <ThumbsUp size={16} className="mr-1" />
              <span className="text-xs">
                {likesCount[ideaId] || initialLikesCount}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {status === "Em Análise" ? "Curtir ideia" : "Like desativado"}
          </TooltipContent>
        </Tooltip>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card-storm sm:max-w-[550px]">
          <DialogHeader className="mb-2 p-0">
            <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
            <Badge className={cn("mt-2 w-fit text-sm", color)}>
              {icon} {status}
            </Badge>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
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
                <AvatarImage src={displayedAvatar} alt={displayedCreator} />{" "}
                {/* Usando o avatar do criador aqui também */}
                <AvatarFallback>{displayedCreator[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  {displayedCreator}
                </p>
                <p className="text-xs text-muted-foreground">
                  Criador(a) da ideia
                </p>
                <p className="text-xs text-muted-foreground">
                  {likesCount[ideaId] || initialLikesCount} curtidas
                </p>
              </div>
            </div>

            <div className="flex-grow" />

            <div className="flex space-x-2">
              {status === "Em Análise" && (
                <Button variant="primary" onClick={handleLikeClick}>
                  <ThumbsUp className="mr-2" size={18} /> Curtir
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
