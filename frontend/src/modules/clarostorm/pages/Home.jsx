import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import { Dialog, DialogTrigger } from "modules/shared/components/ui/dialog";
import { useSubjectsAndCards } from "../hooks/useSubjectsAndCards";
import { useNewCard } from "../hooks/useNewCard";
import StormMenu from "../components/StormMenu";
import SubjectColumns from "../components/SubjectColumns";
import AddIdeaModal from "../components/AddIdeaModal";
import ErrorDisplay from "../components/ErrorDisplay";
import LoadingSpinner from "../components/LoadingSpinner";
import Container from "modules/shared/components/ui/container";

export default function ClaroStorm({ userName, userId }) {
  const { subjects, cards, isLoading, error } = useSubjectsAndCards();
  const { newCard, setNewCard, handleAddCard } = useNewCard(subjects);
  const [showAddModal, setShowAddModal] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <Container innerClassName="lg:px-7 max-w-[1920px] relative mx-0">
      <StormMenu />
      <SubjectColumns subjects={subjects} cards={cards} />
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-4 right-4 rounded-full p-3 shadow-lg transition-shadow duration-300 hover:shadow-xl sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:bottom-24 lg:right-12"
            size="icon"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <AddIdeaModal
          newCard={newCard}
          setNewCard={setNewCard}
          handleAddCard={handleAddCard}
          subjects={subjects}
          onClose={() => setShowAddModal(false)}
          userName={userName}
          userId={userId}
        />
      </Dialog>
    </Container>
  );
}
