import React from "react";
import { ThumbsUp } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import { Badge } from "modules/shared/components/ui/badge";

export default function IdeaCard({
  title = "Título da Ideia",
  description = "Descrição da ideia vai aqui. Se nenhuma descrição for fornecida, este texto será exibido como padrão.",
  creator = "Usuário Anônimo",
  likes = 0,
  avatar = "/placeholder-avatar.png",
  status = "Em análise",
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Em análise":
        return "bg-warning text-warning-foreground hover:opacity-80";
      case "Aprovado":
        return "bg-green-200 text-green-800";
      case "Arquivada":
        return "bg-red-200 text-red-800";
      default:
        return "bg-warning text-warning-foreground";
    }
  };

  return (
    <div className="relative h-28 select-none rounded-lg bg-white shadow">
      {/* <h4 className="mb-2 text-lg font-medium">{title}</h4> */}
      <p className="absolute left-2 top-1 max-w-[250px] truncate text-xs text-muted">
        {description}
      </p>

      <div>
        <img
          src={avatar}
          alt={creator}
          className="absolute bottom-2 left-2 mr-3 h-10 w-10 rounded-full"
        />
        <span className="absolute bottom-8 left-[65px] text-xs font-semibold">
          {creator}
        </span>

        <Badge
          className={` ${getStatusColor(status)} absolute bottom-2 left-16 text-[8px]`}
        >
          {status}
        </Badge>

        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-1 right-2 p-0"
        >
          <ThumbsUp size={20} className="mr-1" />
          <span className="absolute bottom-5 right-0">{likes}</span>
        </Button>
      </div>
    </div>
  );
}
