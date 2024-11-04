import React, { useState, useEffect, useMemo } from "react";
import IdeaCard from "modules/clarostorm/components/board/IdeaCard";

export default function StormBoard({ subjects, cards, currentFilter }) {
  const [activeSubject, setActiveSubject] = useState(subjects[0]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const filteredAndSortedCards = useMemo(() => {
    const filtered = {};
    for (const subject in cards) {
      filtered[subject] = cards[subject]
        .filter((card) => {
          if (currentFilter === "all") return true;
          if (currentFilter === "emAnalise")
            return card.status === "Em Análise";
          if (currentFilter === "aprovados") return card.status === "Aprovada";
          if (currentFilter === "arquivados")
            return card.status === "Arquivada";
          return true;
        })
        .sort((a, b) => (b.likedBy?.length || 0) - (a.likedBy?.length || 0));
    }
    return filtered;
  }, [cards, currentFilter]);

  return (
    <div className="select-none sm:mx-0 lg:mx-10">
      {isMobile ? (
        <div className="flex flex-col">
          <div className="scrollbar-storm flex overflow-x-auto rounded-lg">
            {subjects.map((subject, index) => (
              <button
                key={subject}
                className={`whitespace-nowrap px-4 py-2 ${
                  activeSubject === subject
                    ? "text-menu-foreground bg-accent"
                    : "text-menu-foreground bg-menu"
                }`}
                onClick={() => setActiveSubject(subject)}
              >
                {subject}
              </button>
            ))}
          </div>
          <div className="max-h-[75vh] flex-1 overflow-y-auto">
            <div className="mt-4 space-y-5 p-4">
              {filteredAndSortedCards[activeSubject]?.map((card) => (
                <IdeaCard key={card._id} ideaId={card._id} {...card} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex max-h-[75vh] min-h-[75vh] drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]">
          {subjects.map((subject, index) => (
            <div
              key={subject}
              className={`bg-board relative flex w-[300px] flex-shrink-0 flex-col ${
                index === 0 ? "rounded-l-lg" : ""
              } ${index === subjects.length - 1 ? "rounded-r-lg" : ""}`}
            >
              {/* Subjects */}
              <div
                className={`text-menu-foreground bg-board-title relative top-0 flex h-20 items-center justify-center drop-shadow-[0_3px_3px_rgba(0,0,0,0.25)] ${
                  index === 0 ? "rounded-l-lg" : ""
                } ${index === subjects.length - 1 ? "rounded-r-lg" : ""}`}
              >
                <h2 className="text-center text-xl font-medium antialiased">
                  {subject}
                </h2>

                {/* Divisor vertical menor */}
                {index !== 0 && (
                  <div className="absolute bottom-4 left-[-2px] top-4 w-[1px] bg-white/50"></div>
                )}
              </div>

              {/* Divisor vertical maior */}
              {index !== subjects.length - 1 && (
                <div className="absolute right-[2.5px] top-32 w-[1px] bg-foreground/20"></div>
              )}

              {/* Board e cards */}
              <div className="bg-board py-2" />
              <div
                className={`scrollbar-storm bg-board flex-1 overflow-y-auto ${
                  index === 0 ? "rounded-bl-lg" : ""
                } ${index === subjects.length - 1 ? "rounded-br-lg" : ""}`}
              >
                <div className="space-y-5 px-5 py-5">
                  {filteredAndSortedCards[subject]?.map((card) => (
                    <IdeaCard key={card._id} ideaId={card._id} {...card} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
