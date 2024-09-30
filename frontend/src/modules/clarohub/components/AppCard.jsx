import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "modules/shared/components/ui/card";
import { Button } from "modules/shared/components/ui/button";
import { Link } from "react-router-dom";
import { BsStar, BsStarFill } from "react-icons/bs";

export default function AppCard({
  nome,
  imagemUrl,
  logoCard,
  rota,
  isFavorite,
  onFavoriteClick,
  onCardClick,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    if (rota === "multi-rotas") {
      e.preventDefault();
      onCardClick();
    }
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteClick();
  };

  return (
    <Card
      className="group relative h-[300px] w-[200px] overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={rota !== "multi-rotas" ? rota : "/"}
        target={rota !== "multi-rotas" ? "_blank" : "_self"}
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block h-full"
      >
        <CardContent className="h-full p-0">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-300 ease-in-out group-hover:scale-105"
            style={{ backgroundImage: `url(${imagemUrl})` }}
          />
          {/* Opacidade */}
          {
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          }
          {/* Logo */}
          <img
            src={logoCard}
            alt={nome}
            className="absolute left-20 top-32 h-12 w-12 object-contain opacity-60 brightness-75 transition-all duration-300 group-hover:opacity-100"
          />
          {/* Icone Favoritos */}
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
        {/* Nome do App */}
        <CardFooter className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h2 className="w-full truncate text-lg font-bold text-white">
            {nome}
          </h2>
        </CardFooter>
      </Link>
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      )}
    </Card>
  );
}
