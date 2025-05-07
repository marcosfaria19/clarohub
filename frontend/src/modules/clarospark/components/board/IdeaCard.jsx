// src/modules/clarospark/components/IdeaCard.jsx

import React, { useContext, useState, useEffect, useCallback } from "react";
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
  DialogDescription,
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

import useManagerTable from "modules/clarospark/hooks/useManagerTable";
import StatusChanger from "./StatusChanger";

export default function IdeaCard(props) {
  const {
    title,
    description,
    creator,
    likesCount: initialLikesCount = 0,
    status,
    anonymous,
    ideaId,
    createdAt,
    history = [],
  } = props;

  // Monte o objeto inteiro da ideia
  const idea = { ...props };

  const { user } = useContext(AuthContext);
  const { likesCount, handleLike, updateLikeCount } = useLikes();
  const { theme } = useTheme();

  // modal de detalhes
  const [isModalOpen, setIsModalOpen] = useState(false);

  // hook de confirmação compartilhada
  const {
    isConfirmOpen,
    newStatus,
    updateStatus,
    setIsConfirmOpen,
    setSelectedItem,
    setNewStatus,
  } = useManagerTable();

  // indicador "Nova!"
  const { isNew, markAsViewed } = useIdeaIsNew(ideaId, createdAt);

  // likes
  useEffect(() => {
    updateLikeCount(ideaId, initialLikesCount);
  }, [ideaId, initialLikesCount, updateLikeCount]);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    handleLike(ideaId, user.userId).catch(console.error);
  };

  const currentLikes = likesCount[ideaId] || initialLikesCount;
  const likeIcon = getLikeIcon(currentLikes, theme);

  const lastChange = history.length > 0 ? history[history.length - 1] : null;
  const lastChangedBy = lastChange ? lastChange.changedBy : "";
  // abrir/fechar detalhes
  const handleCardClick = () => {
    setIsModalOpen(true);
    markAsViewed();
  };
  const handleCloseModal = () => setIsModalOpen(false);

  // **aqui**: recebe o objeto inteiro e o novo status!
  const handleStatusChange = useCallback(
    (selectedIdea, novoStatus) => {
      console.log("Idea passando ao hook:", selectedIdea, "=>", novoStatus);
      setSelectedItem(selectedIdea);
      setNewStatus(novoStatus);
      setIsConfirmOpen(true);
    },
    [setIsConfirmOpen, setNewStatus, setSelectedItem],
  );

  // só managers/admin
  const canEdit = ["manager", "admin"].includes(user.permissoes);

  // formata criador e data
  const displayedCreator =
    anonymous === 1 ? "Anônimo" : formatUserName(creator.name);
  const displayedAvatar =
    anonymous === 1 ? "/anonymous-avatar.png" : creator.avatar;
  const formattedCreatedAt = format(new Date(createdAt), "dd/MM/yyyy");

  const isLong = description.length > 90;
  const truncated = isLong
    ? `${description.substring(0, 90)} ... `
    : description;

  // cor e ícone do badge
  const { color, icon } = statusConfig[status] || statusConfig["Em Análise"];

  return (
    <TooltipProvider>
      <div
        className={cn(
          "relative h-44 w-full max-w-md cursor-pointer rounded-lg bg-card-spark p-4",
          currentLikes > 99 ? "animate-shadow-pulse" : "border-0",
        )}
        onClick={handleCardClick}
      >
        <NewIndicator isNew={isNew} />

        <h4 className="max-w-[250px] truncate text-sm font-semibold">
          {title}
        </h4>
        <p className="line-clamp-3 text-xs text-foreground">
          {truncated}
          {isLong && <span className="underline">Leia mais</span>}
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

      {/* Modal de detalhes */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card-spark sm:max-w-[550px]">
          <DialogHeader className="mb-2 p-0">
            <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
            <div className="mt-2 flex items-center space-x-2">
              {canEdit ? (
                <StatusChanger
                  currentStatus={status}
                  disabled={status === "Aprovada"}
                  // passo a ideia inteira no callback:
                  onConfirmChange={(novoStatus) =>
                    handleStatusChange(idea, novoStatus)
                  }
                  // evitar propagação p/ não abrir modal de detalhes
                  triggerProps={{ onClick: (e) => e.stopPropagation() }}
                />
              ) : (
                <Badge className={cn("w-fit text-sm", color)}>
                  {icon} {status}
                </Badge>
              )}
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

      {/* Modal de confirmação de status */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-5">
              Confirmar alteração de status
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja alterar o status para {newStatus}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={updateStatus}>Confirmar</Button>
            <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
