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
import Tour from "../components/Tour";
import { AuthContext } from "modules/shared/contexts/AuthContext";

/**
 * Clarospark - Componente principal do módulo Spark
 * Otimizado para performance com memoização adequada e gerenciamento de estado eficiente
 * Implementa todas as funcionalidades em tempo real via WebSocket
 */
export default function Clarospark() {
  // Hooks principais otimizados
  const { subjects, sortedCards, isLoading, error } = useSubjectsAndCards();
  const { newCard, setNewCard, handleAddCard } = useNewCard(subjects);

  // Estados locais memoizados
  const [showAddModal, setShowAddModal] = useState(false);
  const [isManagerView, setIsManagerView] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("emAnalise");
  const [runTour, setRunTour] = useState(true);

  // Contexto do usuário
  const { user } = useContext(AuthContext);

  // Dados do usuário memoizados para evitar re-renders
  const userData = useMemo(
    () => ({
      userId: user?.userId,
      userName: user?.userName,
    }),
    [user?.userId, user?.userName],
  );

  /**
   * Handlers memoizados para performance
   */
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

  /**
   * Renderização condicional otimizada para estados de carregamento e erro
   */
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
    <Container innerClassName="lg:px-7 max-w-[1920px] bg-container">
      {/* Tour de introdução */}
      <Tour runTour={runTour} onFinish={handleTourFinish} />

      {/* Menu principal */}
      <SparkMenu
        onToggleView={handleToggleView}
        onFilterChange={handleFilterChange}
        currentFilter={currentFilter}
      />

      {/* Conteúdo principal - renderização condicional otimizada */}
      {isManagerView ? (
        <ManagerTable subjects={subjects} cards={sortedCards} />
      ) : (
        <>
          {/* Board principal */}
          <SparkBoard
            subjects={subjects}
            cards={sortedCards}
            currentFilter={currentFilter}
            userId={userData.userId}
            userName={userData.userName}
          />

          {/* Botão flutuante para adicionar ideia */}
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

            {/* Modal de adição */}
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
  );
}
