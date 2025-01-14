import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "modules/shared/components/ui/card";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ title, image, path }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(path);
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
          style={{ backgroundImage: `url(${image})` }}
        />
        {/* Opacity overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </CardContent>
      {/* App Name */}
      <CardFooter className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <h2 className="w-full truncate text-lg font-bold text-white">
          {title}
        </h2>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
