import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "modules/shared/components/ui/tooltip";
import { toast } from "sonner";

const Footer = () => {
  const developers = [
    { name: "Marcos Faria", email: "marcos.faria.terceiros@claro.com.br" },
    { name: "Fares Nunes", email: "fares.nunes@claro.com.br" },
  ];

  const copyToClipboard = (email) => {
    navigator.clipboard
      .writeText(email)
      .then(() => {
        toast.success("Email copiado para a área de transferência!");
      })
      .catch(() => {
        toast.error("Falha ao copiar o email. Por favor, tente novamente.");
      });
  };

  return (
    <footer className="select-none bg-menu p-5 text-menu-foreground/80">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
          <p className="text-center text-sm sm:text-left md:text-base">
            &copy; Projetos Americana {new Date().getFullYear()}
          </p>
          <p className="text-center text-sm sm:text-right md:text-base">
            Desenvolvido por:{" "}
            <TooltipProvider>
              {developers.map((dev, index) => (
                <React.Fragment key={dev.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => copyToClipboard(dev.email)}
                        className="hover:text-menu-foreground focus:outline-none"
                        aria-label={`Copiar email de ${dev.name}`}
                      >
                        {dev.name}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{dev.email}</p>
                    </TooltipContent>
                  </Tooltip>
                  {index < developers.length - 1 && " / "}
                </React.Fragment>
              ))}
            </TooltipProvider>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
