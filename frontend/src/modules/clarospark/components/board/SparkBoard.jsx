import React, { useState, useMemo, useEffect, useCallback } from "react";
import IdeaCard from "modules/clarospark/components/board/IdeaCard";
import EditIdeaModal from "modules/clarospark/components/board/EditIdeaModal";
import { useMediaQuery } from "modules/shared/hooks/use-media-query";
import { Dialog } from "modules/shared/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "modules/shared/components/ui/carousel";
import { toast } from "sonner";

/**
 * SparkBoard - Componente principal do quadro de ideias
 * Otimizado para performance com memoização adequada e gerenciamento de estado eficiente
 * Suporte completo a edição em tempo real via WebSocket
 */
export default function SparkBoard({
  subjects = [],
  cards = {},
  currentFilter,
  userId,
  userName,
  onUpdateIdeas,
  refreshData, // Nova prop para atualização manual
}) {
  // Estados locais otimizados
  const [activeSubject, setActiveSubject] = useState(() => subjects[0] || "");
  const [editingIdea, setEditingIdea] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Media queries memoizadas
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const [avatarCache, setAvatarCache] = useState({});

  useEffect(() => {
    // Preencher o cache inicial com avatares dos cards
    const newCache = {};
    Object.values(cards)
      .flat()
      .forEach((card) => {
        if (card.creator && card.creator.avatar) {
          newCache[card.creator._id] = card.creator.avatar;
        }
      });
    setAvatarCache((prev) => ({ ...prev, ...newCache }));
  }, [cards]);

  /**
   * Atualiza activeSubject quando subjects mudam
   * Evita bugs quando subjects são carregados assincronamente
   */
  useEffect(() => {
    if (subjects.length > 0 && !activeSubject) {
      setActiveSubject(subjects[0]);
    }
  }, [subjects, activeSubject]);

  /**
   * Filtros e ordenação de cards otimizados
   * Memoizado para evitar re-computação desnecessária
   */
  const filteredAndSortedCards = useMemo(() => {
    const filterCardsByStatus = (card) => {
      if (!card) return false;

      switch (currentFilter) {
        case "all":
          return true;
        case "emAnalise":
          return card.status === "Em Análise";
        case "emAndamento":
          return card.status === "Em Andamento";
        case "aprovados":
          return card.status === "Aprovada";
        case "arquivados":
          return card.status === "Arquivada";
        case "minhasIdeias":
          return card.creator?._id === userId;
        default:
          return true;
      }
    };

    const filteredCards = {};

    for (const subject in cards) {
      const subjectCards = cards[subject] || [];

      filteredCards[subject] = subjectCards
        .filter(filterCardsByStatus)
        .sort((a, b) => {
          // Ordenação otimizada: primeiro por likes, depois por data
          const likesA = a.likesCount || a.likedBy?.length || 0;
          const likesB = b.likesCount || b.likedBy?.length || 0;

          if (likesB !== likesA) {
            return likesB - likesA; // Mais likes primeiro
          }

          // Se empate em likes, mais recente primeiro
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }

    return filteredCards;
  }, [cards, currentFilter, userId]);

  /**
   * Inicia edição de uma ideia
   * Memoizado para performance
   */
  const handleEditIdea = useCallback((idea) => {
    if (!idea?._id) {
      console.error("SparkBoard: Ideia inválida para edição", idea);
      toast.error("Erro: Ideia inválida para edição");
      return;
    }

    setEditingIdea(idea);
    setShowEditModal(true);
  }, []);

  /**
   * Fecha modal de edição
   * Memoizado para performance
   */
  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false);
    setEditingIdea(null);
    setIsUpdating(false);
  }, []);

  /**
   * Atualiza uma ideia com otimização otimista
   * Implementa rollback em caso de erro
   */
  const handleUpdateIdea = useCallback(
    async (updatedIdeaResponse) => {
      // O backend retorna {message: '...', idea: {...}}
      // Extrair o objeto idea da resposta
      const updatedIdea = updatedIdeaResponse?.idea || updatedIdeaResponse;

      if (!updatedIdea?._id) {
        console.error(
          "SparkBoard: Ideia atualizada inválida",
          updatedIdeaResponse,
        );
        toast.error("Erro: Dados da ideia inválidos");
        return;
      }

      setIsUpdating(true);

      try {
        // Fechar modal imediatamente para melhor UX
        // A atualização em tempo real via WebSocket cuidará da sincronização
        setShowEditModal(false);
        setEditingIdea(null);

        // Notificar componente pai se necessário
        if (onUpdateIdeas) {
          await onUpdateIdeas(updatedIdea);
        }

        // Forçar atualização manual se WebSocket não estiver funcionando
        if (refreshData) {
          await refreshData();
        }

        toast.success("Ideia atualizada com sucesso!");
      } catch (error) {
        console.error("SparkBoard: Erro ao processar atualização", error);

        // Reabrir modal em caso de erro
        setShowEditModal(true);
        setEditingIdea(updatedIdea);

        toast.error("Erro ao atualizar ideia. Tente novamente.");
      } finally {
        setIsUpdating(false);
      }
    },
    [onUpdateIdeas, refreshData],
  );

  /**
   * Renderiza abas de setores para mobile
   * Memoizado para performance
   */
  const renderSubjectTabs = useMemo(
    () => (
      <div className="scrollbar-spark mb-4 flex overflow-x-auto rounded-lg">
        {[...subjects].sort().map((subject) => (
          <button
            key={subject}
            className={`whitespace-nowrap px-4 py-2 transition-colors duration-200 ${
              activeSubject === subject
                ? "bg-accent text-menu-foreground"
                : "bg-menu text-menu-foreground hover:bg-accent/80"
            }`}
            onClick={() => setActiveSubject(subject)}
          >
            {subject}
          </button>
        ))}
      </div>
    ),
    [subjects, activeSubject],
  );

  /**
   * Renderização para mobile
   * Otimizada com memoização de componentes
   */
  const renderMobileView = useMemo(
    () => (
      <div className="flex flex-col">
        {renderSubjectTabs}
        <div className="max-h-[75vh] flex-1 overflow-y-auto">
          <div className="mt-4 space-y-5 p-4">
            {filteredAndSortedCards[activeSubject]?.map((card) => (
              <IdeaCard
                key={card?._id}
                ideaId={card?._id}
                {...card}
                onEdit={handleEditIdea}
                isUpdating={isUpdating && editingIdea?._id === card?._id}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    [
      renderSubjectTabs,
      filteredAndSortedCards,
      activeSubject,
      handleEditIdea,
      isUpdating,
      editingIdea,
    ],
  );

  /**
   * Renderização para tablet (carousel)
   * Otimizada com memoização
   */
  const renderTabletView = useMemo(
    () => (
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
                    <IdeaCard
                      key={card?._id}
                      ideaId={card?._id}
                      {...card}
                      onEdit={handleEditIdea}
                      avatarCache={avatarCache}
                      isUpdating={isUpdating && editingIdea?._id === card?._id}
                    />
                  ))}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    ),
    [
      subjects,
      filteredAndSortedCards,
      handleEditIdea,
      isUpdating,
      editingIdea,
      avatarCache,
    ],
  );

  /**
   * Renderização para desktop
   * Otimizada com memoização e cálculos de layout eficientes
   */
  const renderDesktopView = useMemo(() => {
    const sortedSubjects = [...subjects].sort();

    return (
      <div className="scrollbar-hide flex max-h-[75vh] min-h-[75vh] overflow-x-auto drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]">
        {sortedSubjects.map((subject, index) => {
          const isFirst = index === 0;
          const isLast = index === sortedSubjects.length - 1;

          return (
            <div
              key={subject}
              className={`relative flex min-w-[300px] max-w-[400px] flex-1 flex-col bg-board ${
                isFirst ? "rounded-l-lg" : ""
              } ${isLast ? "rounded-r-lg" : ""}`}
            >
              {/* Header do setor */}
              <div
                className={`relative top-0 flex h-20 items-center justify-center bg-board-title text-menu-foreground drop-shadow-[0_3px_3px_rgba(0,0,0,0.25)] ${
                  isFirst ? "rounded-tl-lg" : ""
                } ${isLast ? "rounded-tr-lg" : ""}`}
              >
                <h2 className="px-2 text-center text-xl font-medium antialiased">
                  {subject}
                </h2>

                {/* Separador vertical esquerdo */}
                {!isFirst && (
                  <div className="absolute bottom-4 left-0 top-4 w-[1px] bg-white/50" />
                )}
              </div>

              {/* Separador vertical direito */}
              {!isLast && (
                <div className="absolute bottom-5 right-0 top-32 w-[1px] bg-foreground/30" />
              )}

              {/* Espaçador */}
              <div className="bg-board py-2" />

              {/* Conteúdo dos cards */}
              <div
                className={`scrollbar-spark flex-1 overflow-y-auto bg-board ${
                  isFirst ? "rounded-bl-lg" : ""
                } ${isLast ? "rounded-br-lg" : ""}`}
              >
                <div className="space-y-5 px-5 py-5">
                  {filteredAndSortedCards[subject]?.map((card) => (
                    <IdeaCard
                      key={card?._id}
                      ideaId={card?._id}
                      {...card}
                      onEdit={handleEditIdea}
                      isUpdating={isUpdating && editingIdea?._id === card?._id}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [
    subjects,
    filteredAndSortedCards,
    handleEditIdea,
    isUpdating,
    editingIdea,
  ]);

  return (
    <>
      {/* Board principal */}
      <div className="tour-sparkboard select-none sm:mx-0 lg:mx-10">
        {isMobile
          ? renderMobileView
          : isTablet
            ? renderTabletView
            : renderDesktopView}
      </div>

      {/* Modal de edição */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        {editingIdea && (
          <EditIdeaModal
            idea={editingIdea}
            subjects={subjects}
            onClose={handleCloseEditModal}
            userName={userName}
            userId={userId}
            onUpdate={handleUpdateIdea}
            isUpdating={isUpdating}
          />
        )}
      </Dialog>
    </>
  );
}
