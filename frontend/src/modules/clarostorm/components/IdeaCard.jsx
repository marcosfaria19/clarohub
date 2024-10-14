import React, { useState } from "react";
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

const statusConfig = {
  "Em análise": {
    color: "bg-warning text-warning-foreground hover:bg-warning/80",
    icon: "🕒",
  },
  Aprovada: {
    color: "bg-success text-success-foreground hover:bg-success/80",
    icon: "✅",
  },
  Arquivada: {
    color: "bg-destructive text-destructive-foreground hover:destructive/80",
    icon: "📝",
  },
};

export default function IdeaCard({
  title = "Título da Ideia",
  description = "Descrição da ideia vai aqui. Se nenhuma descrição for fornecida, este texto será exibido como padrão.",
  creator = "Usuário Anônimo",
  likes = 0,
  avatar = "/placeholder-avatar.png",
  status = "Em análise",
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { color, icon } = statusConfig[status] || statusConfig["Em análise"];

  const handleCardClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const isLongDescription = description.length > 100;
  const truncatedDescription = isLongDescription
    ? `${description.substring(0, 100)} ... `
    : description;

  return (
    <TooltipProvider>
      <div
        className="relative h-36 cursor-pointer select-none rounded-lg bg-card p-4 shadow transition-shadow hover:shadow-md"
        onClick={handleCardClick}
      >
        <h4 className="mb-1 max-w-[250px] truncate text-sm font-medium">
          {title}
        </h4>

        <p className="mb-2 line-clamp-3 text-xs text-muted-foreground">
          {truncatedDescription}
          {isLongDescription && <span className="underline">Leia mais</span>}
        </p>

        <div className="absolute bottom-2 left-2 flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar} alt={creator} />
            <AvatarFallback>{creator[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-2 flex max-w-[120px] flex-col">
            <span className="ml-1 truncate text-xs font-semibold">
              {formatUserName(creator)}
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
              className="absolute bottom-1 right-4 p-1"
              onClick={(e) => e.stopPropagation()}
            >
              <ThumbsUp size={16} className="mr-1" />
              <span className="text-xs">{likes}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Curtir ideia</TooltipContent>
        </Tooltip>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader className="mb-2 p-0">
            <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
            <Badge className={cn("mt-2 w-fit text-sm", color)}>
              {icon} {status}
            </Badge>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{description}</p>
              <Separator />

              <Separator />
              <div className="flex items-center justify-between"></div>
            </div>
          </ScrollArea>
          <DialogFooter className="flex items-center justify-between">
            {/* Container para o avatar, nome e likes */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={avatar} alt={creator} />
                <AvatarFallback>{creator[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  {formatUserName(creator)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Criador(a) da ideia
                </p>
                <p className="text-xs text-muted-foreground">
                  {likes} curtidas
                </p>
              </div>
            </div>

            {/* Flex-grow para empurrar os botões para a direita */}
            <div className="flex-grow" />

            {/* Container para os botões */}
            <div className="flex space-x-2">
              <Button variant="primary">
                <ThumbsUp className="mr-2" size={18} /> Curtir
              </Button>
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
