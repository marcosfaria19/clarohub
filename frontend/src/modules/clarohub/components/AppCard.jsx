import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "modules/shared/components/ui/card";
import { Button } from "modules/shared/components/ui/button";
import { BsStar, BsStarFill } from "react-icons/bs";

const AppCard = ({
  nome,
  imagemUrl,
  logoCard,
  rota,
  isFavorite,
  onFavoriteClick,
  onCardClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

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
      className="group relative h-[200px] w-full cursor-pointer overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        {/* Favorite Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-50 text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-80"
          onClick={handleFavoriteClick}
        >
          {isFavorite ? (
            <BsStarFill className="h-5 w-5" />
          ) : (
            <BsStar className="h-5 w-5" />
          )}
        </Button>
      </CardContent>
      {/* App Name */}
      <CardFooter className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <h2 className="w-full truncate text-lg font-bold text-white">{nome}</h2>
      </CardFooter>
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      )}
    </Card>
  );
};

export default AppCard;
