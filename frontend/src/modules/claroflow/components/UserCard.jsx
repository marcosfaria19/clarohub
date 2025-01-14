import React, { useState } from "react";
import { Button } from "modules/shared/components/ui/button";
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
  DialogFooter,
} from "modules/shared/components/ui/dialog";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "modules/shared/components/ui/avatar";
import formatUserName from "modules/shared/utils/formatUsername";

export default function UserCard({ id, NOME, GESTOR, avatar }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const displayedCreator = formatUserName(NOME);

  return (
    <TooltipProvider>
      <div
        className="relative h-36 w-full max-w-md cursor-pointer rounded-lg bg-card-spark p-4"
        onClick={handleCardClick}
      >
        <h4 className="max-w-[250px] truncate text-sm font-semibold">{NOME}</h4>

        <div className="absolute bottom-3 left-4 flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar} alt={displayedCreator} />
            <AvatarFallback>{displayedCreator[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-2 flex max-w-[120px] flex-col">
            <span className="text-xs text-muted-foreground">
              Gestor: {GESTOR}
            </span>
          </div>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="absolute bottom-3 right-3 h-8 w-8 rounded-full p-0"
            >
              <span className="sr-only">Mais informações</span>
              {/* Você pode adicionar um ícone de informação aqui */}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clique para mais detalhes</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card-spark sm:max-w-[550px]">
          <DialogHeader className="mb-2 p-0">
            <h3 className="text-lg font-semibold">Detalhes do Usuário</h3>
          </DialogHeader>
          <ScrollArea className="max-h-[40dvh] pr-4">
            <p>
              <strong>Nome:</strong> {NOME}
            </p>
            <p>
              <strong>Gestor:</strong> {GESTOR}
            </p>
            {/* Adicione mais detalhes do usuário aqui */}
          </ScrollArea>
          <DialogFooter className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatar} alt={displayedCreator} />
                <AvatarFallback>{displayedCreator[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{NOME}</p>
                <p className="text-xs text-muted-foreground">ID: {id}</p>
              </div>
            </div>

            <div className="flex-grow" />

            <div className="flex space-x-2">
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
