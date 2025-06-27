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
import NewIndicator from "modules/clarospark/components/board/NewIndicator";
import { cn } from "modules/shared/lib/utils";

const AppCard = ({
  nome,
  imagemUrl,
  logoCard,
  isFavorite,
  onFavoriteClick,
  onCardClick,
  info,
  isNew,
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
    <div className={cn("relative", isNew && "m-[6px]")}>
      {/* New Indicator fora do Card */}
      {isNew && <NewIndicator isNew={isNew} />}

      <Card
        className={cn(
          "group relative h-[200px] w-full cursor-pointer select-none overflow-visible rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg",
          isNew && "h-[188px]",
        )}
        onClick={handleClick}
      >
        {/* Background Wrapper (pode ter overflow-hidden) */}
        <div className="relative h-full overflow-hidden rounded-lg">
          <CardContent className="absolute inset-0 p-0">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-in-out group-hover:scale-105"
              style={{ backgroundImage: `url(${imagemUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </CardContent>
        </div>

        {/* Overlay Content – FORA da div com overflow-hidden */}
        <CardContent className="pointer-events-none absolute inset-0 z-50 p-0">
          <img
            src={logoCard}
            alt={nome}
            className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform object-contain opacity-60 brightness-75 transition-all duration-300 group-hover:opacity-100"
          />

          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <InfoIcon className="pointer-events-auto absolute left-4 top-5 h-5 w-5 cursor-help text-primary-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-80" />
              </TooltipTrigger>
              <Portal>
                <TooltipContent className="max-w-[300px] break-words">
                  <p className="line-clamp-3">{info}</p>
                </TooltipContent>
              </Portal>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="pointer-events-auto absolute right-2 top-2 text-primary-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-80"
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

        <CardFooter className="absolute bottom-0 left-0 right-0 rounded-lg bg-gradient-to-t from-black to-transparent p-4">
          <h2 className="w-full truncate text-lg font-bold text-primary-foreground">
            {nome}
          </h2>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppCard;
