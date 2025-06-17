import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  memo,
  useMemo,
} from "react";
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
import { formatUserName } from "modules/shared/utils/formatUsername";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useLikes } from "modules/clarospark/hooks/useLikes";
import statusConfig from "modules/clarospark/utils/statusConfig";
import { getLikeIcon } from "modules/clarospark/utils/getLikeIcon";
import spark from "modules/clarospark/assets/f0.png";
import { useTheme } from "modules/shared/contexts/ThemeContext";
import { Edit, Loader2 } from "lucide-react";

import { useIdeaIsNew } from "modules/clarospark/hooks/useIdeaIsNew";
import NewIndicator from "./NewIndicator";
import useManagerTable from "modules/clarospark/hooks/useManagerTable";
import StatusChanger from "./StatusChanger";
import { format } from "date-fns";

function IdeaCard(props) {
  const {
    title = "",
    description = "",
    creator = {},
    likesCount: initialLikesCount = 0,
    status = "Em Análise",
    anonymous = 0,
    ideaId,
    createdAt,
    history = [],
    onEdit,
    isUpdating = false,
  } = props;

  const idea = { ...props };
  const { user } = useContext(AuthContext);
  const { likesCount, handleLike, updateLikeCount } = useLikes();
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    isConfirmOpen,
    newStatus,
    updateStatus,
    setIsConfirmOpen,
    setSelectedItem,
    setNewStatus,
  } = useManagerTable();
  const { isNew, markAsViewed } = useIdeaIsNew(ideaId, createdAt);

  // Memoização das verificações de permissão para performance
  const canEdit = useMemo(() => {
    return ["manager", "admin"].includes(user?.permissoes);
  }, [user?.permissoes]);

  const isCreator = useMemo(() => {
    return creator?._id === user?.userId;
  }, [creator?._id, user?.userId]);

  // Memoização dos dados do criador para performance
  const displayedCreator = useMemo(() => {
    return anonymous === 1 ? "Anônimo" : formatUserName(creator?.name || "");
  }, [anonymous, creator?.name]);

  const displayedAvatar = useMemo(() => {
    return anonymous === 1 ? "/anonymous-avatar.png" : creator?.avatar;
  }, [anonymous, creator?.avatar]);

  // Memoização da data formatada para performance
  const formattedCreatedAt = useMemo(() => {
    if (!createdAt) return "";
    try {
      return format(new Date(createdAt), "dd/MM/yyyy");
    } catch (error) {
      console.warn("IdeaCard: Erro ao formatar data", error);
      return "";
    }
  }, [createdAt]);

  // Memoização da descrição truncada para performance
  const { isLong, truncated } = useMemo(() => {
    const isLong = description.length > 90;
    const truncated = isLong
      ? `${description.substring(0, 90)} ... `
      : description;
    return { isLong, truncated };
  }, [description]);

  // Memoização da configuração de status para performance
  const { color, icon } = useMemo(() => {
    return statusConfig[status] || statusConfig["Em Análise"];
  }, [status]);

  useEffect(() => {
    if (ideaId) {
      updateLikeCount(ideaId, initialLikesCount);
    }
  }, [ideaId, initialLikesCount, updateLikeCount]);

  // Callback otimizado para like
  const handleLikeClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (ideaId && user?.userId && !isUpdating) {
        console.log("IdeaCard: Processando like", {
          ideaId,
          userId: user.userId,
        });
        handleLike(ideaId, user.userId).catch((error) => {
          console.error("IdeaCard: Erro ao processar like", error);
        });
      }
    },
    [ideaId, user?.userId, isUpdating, handleLike],
  );

  // Callback otimizado para edição
  const handleEditClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (onEdit && idea && !isUpdating) {
        console.log("IdeaCard: Iniciando edição", { ideaId, title });
        onEdit(idea);
      }
    },
    [onEdit, idea, isUpdating, ideaId, title],
  );

  // Callback otimizado para mudança de status
  const handleStatusChange = useCallback(
    (selectedIdea, novoStatus) => {
      if (isUpdating) return; // Prevenir mudança de status durante atualização

      console.log("IdeaCard: Alterando status", { ideaId, novoStatus });
      setSelectedItem(selectedIdea);
      setNewStatus(novoStatus);
      setIsConfirmOpen(true);
    },
    [setIsConfirmOpen, setNewStatus, setSelectedItem, isUpdating, ideaId],
  );

  // Callback otimizado para abertura do modal
  const handleCardClick = useCallback(() => {
    if (isUpdating) return; // Prevenir abertura do modal durante atualização

    setIsModalOpen(true);
    if (markAsViewed) {
      markAsViewed();
    }
  }, [isUpdating, markAsViewed]);

  // Callback otimizado para fechamento do modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const currentLikes = likesCount[ideaId] || initialLikesCount;
  const likeIcon = getLikeIcon(currentLikes, theme);

  const lastChange = history.length > 0 ? history[history.length - 1] : null;
  const lastChangedBy = lastChange ? lastChange.changedBy : "";

  // Verificação de segurança para dados essenciais
  if (!ideaId || !title) {
    console.warn("IdeaCard: Dados essenciais ausentes", { ideaId, title });
    return null;
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          "relative h-44 w-full max-w-md cursor-pointer rounded-lg bg-card-spark p-4 transition-opacity",
          currentLikes > 99 ? "animate-shadow-pulse" : "border-0",
          isUpdating ? "cursor-wait opacity-75" : "", // Feedback visual durante atualização
        )}
        onClick={handleCardClick}
      >
        <NewIndicator isNew={isNew} />

        {/* Indicador de loading durante atualização */}
        {isUpdating && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {/* Botão de editar - apenas para o criador */}
        {isCreator && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 p-1"
                onClick={handleEditClick}
                disabled={isUpdating}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isUpdating ? "Atualizando..." : "Editar ideia"}
            </TooltipContent>
          </Tooltip>
        )}

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
            <AvatarFallback>{displayedCreator[0] || "?"}</AvatarFallback>
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
              disabled={status !== "Em Análise" || isUpdating}
            >
              <img src={likeIcon} alt="Sparks" className="w-6" />
              <span className="relative bottom-4 right-1 text-xs">
                {currentLikes}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isUpdating
              ? "Atualizando..."
              : status === "Em Análise"
                ? "Apoiar ideia"
                : "Like desativado"}
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
                  disabled={status === "Aprovada" || isUpdating}
                  onChange={(newStatus) => handleStatusChange(idea, newStatus)}
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
            {/* Botão de editar - apenas para o criador */}
            {isCreator && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 p-6"
                    onClick={handleEditClick}
                    disabled={isUpdating}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isUpdating ? "Atualizando..." : "Editar ideia"}
                </TooltipContent>
              </Tooltip>
            )}
          </DialogHeader>

          <ScrollArea className="max-h-[40dvh] pr-4">
            <div className="space-y-4">
              <p className="select-text text-sm text-foreground">
                {description}
              </p>
              <Separator />
            </div>
          </ScrollArea>
          <DialogFooter className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={displayedAvatar} alt={displayedCreator} />
                <AvatarFallback>{displayedCreator[0] || "?"}</AvatarFallback>
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
                <Button
                  variant="primary"
                  onClick={handleLikeClick}
                  disabled={isUpdating}
                >
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
            <Button onClick={updateStatus} disabled={isUpdating}>
              Confirmar
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

export default memo(IdeaCard);
