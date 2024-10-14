import React, { useState, useEffect } from "react";
import IdeaCard from "modules/clarostorm/components/IdeaCard";

export default function SubjectColumns({ subjects, cards }) {
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

  return (
    <>
      <div className="flex flex-col rounded-lg border border-border md:flex-row">
        {isMobile ? (
          <>
            <div className="flex max-h-[75vh] overflow-x-auto overflow-y-auto rounded-lg">
              {subjects.map((subject, index) => (
                <button
                  key={subject}
                  className={`whitespace-nowrap px-4 py-2 ${
                    activeSubject === subject
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground"
                  }`}
                  onClick={() => setActiveSubject(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="mt-4 space-y-5 p-4">
                {cards[activeSubject] &&
                  cards[activeSubject].map((card, cardIndex) => (
                    <IdeaCard key={cardIndex} {...card} />
                  ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex max-h-[75vh] rounded-lg border border-border">
            {subjects.map((subject, index) => (
              <div
                key={subject}
                className="flex w-[308px] flex-shrink-0 flex-col bg-card"
              >
                <div className="sticky top-0 z-10 flex h-20 items-center justify-center text-foreground">
                  {index !== subjects.length - 1 && (
                    <div className="absolute bottom-5 right-1 top-5 w-[1px] bg-card-foreground/20"></div>
                  )}
                  <h2 className="text-center text-lg font-medium antialiased">
                    {subject}
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="mt-10 space-y-5 p-2">
                    {cards[subject] &&
                      cards[subject].map((card, cardIndex) => (
                        <IdeaCard key={cardIndex} {...card} />
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
