import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "modules/shared/components/ui/card";
import { Button } from "modules/shared/components/ui/button";
import { BsStar, BsStarFill } from "react-icons/bs";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "modules/shared/components/ui/tooltip";
import { Portal } from "@radix-ui/react-tooltip";

const AppCard = ({
  nome,
  imagemUrl,
  logoCard,
  isFavorite,
  onFavoriteClick,
  onCardClick,
  info,
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    onCardClick();
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteClick();
  };

  return (
    <Card
      className="group relative h-[200px] w-full cursor-pointer select-none overflow-hidden rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg"
      onClick={handleClick}
    >
      <CardContent className="h-full p-0">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-300 ease-in-out group-hover:scale-105"
          style={{ backgroundImage: `url(${imagemUrl})` }}
        />
        {/* Opacity overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {/* Logo */}
        <img
          src={logoCard}
          alt={nome}
          className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform object-contain opacity-60 brightness-75 transition-all duration-300 group-hover:opacity-100"
        />
        {/* Info Icon + Tooltip */}
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <InfoIcon className="absolute left-4 top-5 h-5 w-5 cursor-help text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-80" />
            </TooltipTrigger>
            <Portal>
              <TooltipContent className="max-w-[300px] break-words">
                <p className="line-clamp-3">{info}</p>
              </TooltipContent>
            </Portal>
          </Tooltip>
        </TooltipProvider>
        {/* Favorite Icon + Tooltip */}
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-40 text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-80"
                onClick={handleFavoriteClick}
              >
                {isFavorite ? (
                  <BsStarFill className="h-5 w-5" />
                ) : (
                  <BsStar className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <Portal>
              <TooltipContent>
                <p>
                  {isFavorite
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"}
                </p>
              </TooltipContent>
            </Portal>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
      {/* App Name */}
      <CardFooter className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <h2 className="w-full truncate text-lg font-bold text-white">{nome}</h2>
      </CardFooter>
    </Card>
  );
};

export default AppCard;
