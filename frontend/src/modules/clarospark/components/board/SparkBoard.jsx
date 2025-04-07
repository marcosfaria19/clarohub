import React, { useState, useMemo } from "react";
import IdeaCard from "modules/clarospark/components/board/IdeaCard";
import { useMediaQuery } from "modules/shared/hooks/use-media-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "modules/shared/components/ui/carousel";

export default function SparkBoard({ subjects, cards, currentFilter, userId }) {
  const [activeSubject, setActiveSubject] = useState(subjects[0]);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const filteredAndSortedCards = useMemo(() => {
    const filterCardsByStatus = (card) => {
      switch (currentFilter) {
        case "all":
          return true;
        case "emAnalise":
          return card.status === "Em Análise" || card.status === "Em Andamento";
        case "emAndamento":
          return card.status === "Em Andamento";
        case "aprovados":
          return card.status === "Aprovada";
        case "arquivados":
          return card.status === "Arquivada";
        case "minhasIdeias":
          return card.creator._id === userId;
        default:
          return true;
      }
    };

    const filteredCards = {};
    for (const subject in cards) {
      filteredCards[subject] = cards[subject]
        .filter(filterCardsByStatus)
        .sort((a, b) => b.likesCount - a.likesCount);
    }

    return filteredCards;
  }, [cards, currentFilter, userId]);

  const renderSubjectTabs = () => (
    <div className="scrollbar-spark mb-4 flex overflow-x-auto rounded-lg">
      {[...subjects].sort().map((subject) => (
        <button
          key={subject}
          className={`whitespace-nowrap px-4 py-2 ${
            activeSubject === subject
              ? "bg-accent text-menu-foreground"
              : "bg-menu text-menu-foreground"
          }`}
          onClick={() => setActiveSubject(subject)}
        >
          {subject}
        </button>
      ))}
    </div>
  );

  const renderMobileView = () => (
    <div className="flex flex-col">
      {renderSubjectTabs()}
      <div className="max-h-[75vh] flex-1 overflow-y-auto">
        <div className="mt-4 space-y-5 p-4">
          {filteredAndSortedCards[activeSubject]?.map((card) => (
            <IdeaCard key={card._id} ideaId={card._id} {...card} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabletView = () => (
    <Carousel
      opts={{
        align: "start",
        loop: false,
        skipSnaps: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {[...subjects].sort().map((subject) => (
          <CarouselItem
            key={subject}
            className="basis-full sm:basis-1/2 lg:basis-1/3"
          >
            <div className="flex h-[75vh] flex-col rounded-lg bg-board">
              <div className="flex h-20 items-center justify-center bg-board-title text-menu-foreground">
                <h2 className="text-center text-xl font-medium antialiased">
                  {subject}
                </h2>
              </div>
              <div className="scrollbar-spark flex-1 space-y-5 overflow-y-auto p-5">
                {filteredAndSortedCards[subject]?.map((card) => (
                  <IdeaCard key={card._id} ideaId={card._id} {...card} />
                ))}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );

  const renderDesktopView = () => (
    <div className="flex max-h-[75vh] min-h-[75vh] drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]">
      {[...subjects].sort().map((subject, index, sortedSubjects) => (
        <div
          key={subject}
          className={`relative flex w-[300px] flex-shrink-0 flex-col bg-board ${
            index === 0 ? "rounded-l-lg" : ""
          } ${index === sortedSubjects.length - 1 ? "rounded-r-lg" : ""}`}
        >
          <div
            className={`relative top-0 flex h-20 items-center justify-center bg-board-title text-menu-foreground drop-shadow-[0_3px_3px_rgba(0,0,0,0.25)] ${
              index === 0 ? "rounded-tl-lg" : ""
            } ${index === sortedSubjects.length - 1 ? "rounded-tr-lg" : ""}`}
          >
            <h2 className="text-center text-xl font-medium antialiased">
              {subject}
            </h2>
            {index !== 0 && (
              <div className="absolute bottom-4 left-[-2px] top-4 w-[1px] bg-white/50"></div>
            )}
          </div>
          {index !== sortedSubjects.length - 1 && (
            <div className="absolute bottom-5 right-[1px] top-32 w-[1px] bg-foreground/30"></div>
          )}
          <div className="bg-board py-2" />
          <div
            className={`scrollbar-spark flex-1 overflow-y-auto bg-board ${
              index === 0 ? "rounded-bl-lg" : ""
            } ${index === sortedSubjects.length - 1 ? "rounded-br-lg" : ""}`}
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
  );

  return (
    <div className="tour-sparkboard select-none sm:mx-0 lg:mx-10">
      {isMobile
        ? renderMobileView()
        : isTablet
          ? renderTabletView()
          : renderDesktopView()}
    </div>
  );
}
