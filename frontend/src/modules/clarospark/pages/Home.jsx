import React, { useContext, useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "modules/shared/components/ui/dialog";
import { useSubjectsAndCards } from "modules/clarospark/hooks/useSubjectsAndCards";
import { useNewCard } from "modules/clarospark/hooks/useNewCard";
import SparkMenu from "modules/clarospark/components/board/SparkMenu";
import SparkBoard from "modules/clarospark/components/board/SparkBoard";
import ManagerTable from "modules/clarospark/components/board/ManagerTable";
import AddIdeaModal from "modules/clarospark/components/board/AddIdeaModal";
import ErrorDisplay from "modules/clarospark/components/ErrorDisplay";
import LoadingSpinner from "modules/clarospark/components/LoadingSpinner";
import Container from "modules/shared/components/ui/container";
import { Button } from "modules/shared/components/ui/button";

import { AuthContext } from "modules/shared/contexts/AuthContext";
import { SparkProvider } from "modules/clarospark/hooks/sparkContext";
import Tour from "modules/clarospark/components/Tour";

export default function Clarospark() {
  const { subjects, sortedCards, isLoading, error } = useSubjectsAndCards();
  const { newCard, setNewCard, handleAddCard } = useNewCard(subjects);

  const [showAddModal, setShowAddModal] = useState(false);
  const [isManagerView, setIsManagerView] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("emAnalise");
  const [runTour, setRunTour] = useState(true);

  const { user } = useContext(AuthContext);

  const userData = useMemo(
    () => ({
      userId: user?.userId,
      userName: user?.userName,
    }),
    [user?.userId, user?.userName],
  );

  const handleToggleView = useMemo(
    () => () => setIsManagerView((prev) => !prev),
    [],
  );

  const handleFilterChange = useMemo(
    () => (filter) => setCurrentFilter(filter),
    [],
  );

  const handleTourFinish = useMemo(() => () => setRunTour(false), []);
  const handleCloseAddModal = useMemo(() => () => setShowAddModal(false), []);
  const handleOpenAddModal = useMemo(() => () => setShowAddModal(true), []);

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorDisplay message={error} />
      </Container>
    );
  }

  return (
    <SparkProvider userId={userData.userId}>
      <Container innerClassName="lg:px-7 max-w-[1920px] bg-container">
        <Tour runTour={runTour} onFinish={handleTourFinish} />

        <SparkMenu
          onToggleView={handleToggleView}
          onFilterChange={handleFilterChange}
          currentFilter={currentFilter}
        />

        {isManagerView ? (
          <ManagerTable subjects={subjects} cards={sortedCards} />
        ) : (
          <>
            <SparkBoard
              subjects={subjects}
              cards={sortedCards}
              currentFilter={currentFilter}
              userId={userData.userId}
              userName={userData.userName}
            />

            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogTrigger asChild>
                <Button
                  className="tour-sparkadd fixed bottom-0 left-[calc(100%-100px)] rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:bottom-24 lg:right-12"
                  size="icon"
                  onClick={handleOpenAddModal}
                  aria-label="Adicionar nova ideia"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </DialogTrigger>

              <AddIdeaModal
                newCard={newCard}
                setNewCard={setNewCard}
                handleAddCard={handleAddCard}
                subjects={subjects}
                onClose={handleCloseAddModal}
                userName={userData.userName}
                userId={userData.userId}
              />
            </Dialog>
          </>
        )}
      </Container>
    </SparkProvider>
  );
}
