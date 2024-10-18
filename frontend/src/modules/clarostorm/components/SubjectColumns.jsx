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
    <div className="mx-10 select-none border border-border">
      {isMobile ? (
        <div className="flex flex-col">
          <div className="flex overflow-x-auto">
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
          <div className="max-h-[75vh] flex-1 overflow-y-auto">
            <div className="mt-4 space-y-5 p-4">
              {cards[activeSubject]?.map((card, cardIndex) => (
                <IdeaCard key={cardIndex} {...card} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex max-h-[75vh]">
          {subjects.map((subject, index) => (
            <div
              key={subject}
              className="relative flex w-[300px] flex-shrink-0 flex-col bg-menu"
            >
              {/* Subjects */}
              <div
                className={`relative top-0 z-10 flex h-20 items-center justify-center bg-card text-foreground ${
                  index === 0 ? "rounded-l-lg" : ""
                } ${index === subjects.length - 1 ? "rounded-r-lg" : ""} `}
              >
                <h2 className="text-center text-xl font-medium antialiased">
                  {subject}
                </h2>

                {/* Divisor vertical menor */}
                {index !== 0 && (
                  <div className="absolute bottom-4 left-[-2px] top-4 w-[1px] bg-foreground/20"></div>
                )}
              </div>

              {/* Divisor vertical maior */}
              {index !== subjects.length - 1 && (
                <div className="absolute bottom-5 right-[2.5px] top-32 w-[1px] bg-card"></div>
              )}

              {/* Board e cards */}
              <div className="p-5" />
              <div className="scrollbar-storm flex-1 overflow-y-auto">
                <div className="space-y-5 px-5 pt-5">
                  {cards[subject]?.map((card, cardIndex) => (
                    <IdeaCard key={cardIndex} {...card} />
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
