import { useState, useEffect } from "react";

export function useIdeaIsNew(ideaId, createdAt, recentDays = 7) {
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    // Recupera do localStorage a lista de ideias vistas
    const viewedIdeas = JSON.parse(localStorage.getItem("viewedIdeas")) || [];

    // Verifica se a ideia já foi vista
    const isIdeaViewed = viewedIdeas.includes(ideaId);

    // Verifica se a ideia foi criada nos últimos "recentDays" dias (no caso foi definido 7 dias)
    const isRecent =
      new Date(createdAt) >
      new Date(Date.now() - recentDays * 24 * 60 * 60 * 1000);

    // Define o estado de "nova" com base nas verificações
    setIsNew(!isIdeaViewed && isRecent);
  }, [ideaId, createdAt, recentDays]);

  const markAsViewed = () => {
    const viewedIdeas = JSON.parse(localStorage.getItem("viewedIdeas")) || [];
    if (!viewedIdeas.includes(ideaId)) {
      viewedIdeas.push(ideaId);
      localStorage.setItem("viewedIdeas", JSON.stringify(viewedIdeas));
    }
    setIsNew(false); // Marca como não nova após visualização
  };

  return { isNew, markAsViewed };
}
