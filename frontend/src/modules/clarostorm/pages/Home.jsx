import React, { useState, useEffect } from "react";
import {
  ThumbsUp,
  Trophy,
  Plus,
  Loader,
  SlidersHorizontal,
} from "lucide-react";
import Pusher from "pusher-js";
import axiosInstance from "services/axios";
import IdeaCard from "modules/clarostorm/components/IdeaCard";
import { Button } from "modules/shared/components/ui/button";
import { Input } from "modules/shared/components/ui/input";
import { Textarea } from "modules/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "modules/shared/components/ui/dialog";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

export default function Component() {
  const [subjects, setSubjects] = useState([]);
  const [cards, setCards] = useState({});
  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
    subject: "",
    creator: "",
    likes: 0,
    status: "Em Análise",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjectsAndCards = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [subjectsResponse, cardsResponse] = await Promise.all([
          axiosInstance.get("/storm/subjects"),
          axiosInstance.get("/storm/ideas"),
        ]);

        if (subjectsResponse.status === 200 && cardsResponse.status === 200) {
          const fetchedSubjects = subjectsResponse.data.map(
            (subject) => subject.nome,
          );
          setSubjects(fetchedSubjects);

          // Organize os cards por assunto
          const updatedCards = fetchedSubjects.reduce((acc, subject) => {
            acc[subject] = cardsResponse.data.filter(
              (card) => card.subject === subject,
            );
            return acc;
          }, {});

          setCards(updatedCards);

          if (fetchedSubjects.length > 0) {
            setNewCard((prev) => ({ ...prev, subject: fetchedSubjects[0] }));
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError(
          "Falha ao carregar os dados. Por favor, tente novamente mais tarde.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjectsAndCards();

    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: process.env.REACT_APP_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe("claro-storm");
    channel.bind("new-idea", function (data) {
      setCards((prevCards) => ({
        ...prevCards,
        [data.card.subject]: [
          ...(prevCards[data.card.subject] || []),
          data.card,
        ],
      }));
    });

    return () => {
      channel.unbind("new-idea");
      pusher.unsubscribe("claro-storm");
    };
  }, []);

  const handleAddCard = async () => {
    try {
      const response = await axiosInstance.post("/storm/add-idea", newCard);
      if (response.status === 201) {
        setNewCard({
          title: "",
          description: "",
          subject: subjects[0] || "",
          creator: "",
          likes: 0,
          status: "Em Análise",
        });
        setShowAddModal(false);
      }
    } catch (error) {
      console.error("Erro ao adicionar cartão:", error);
      alert("Falha ao adicionar o cartão. Por favor, tente novamente.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-y-hidden bg-background">
      <div className="mx-4 mt-4 flex justify-end space-x-2 sm:mx-12 sm:mt-6">
        <Button variant="ghost" size="icon">
          <ThumbsUp className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Trophy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <div className="mx-4 mt-4 max-h-screen flex-1 pb-16 sm:mx-12">
        <div className="flex h-full overflow-hidden rounded-lg border border-border">
          {subjects.map((subject, index) => (
            <div
              key={subject}
              className="flex w-[300px] flex-shrink-0 flex-col"
            >
              <div
                className={`flex h-20 items-center justify-center ${index !== subjects.length - 1 ? "border-r" : ""} border-card-foreground/20 bg-menu text-foreground`}
              >
                <h2 className="text-center font-medium antialiased">
                  {subject}
                </h2>
              </div>
              <PerfectScrollbar className="flex-1">
                <div className="space-y-4 p-4">
                  {cards[subject] &&
                    cards[subject].map((card, cardIndex) => (
                      <IdeaCard key={cardIndex} {...card} />
                    ))}
                </div>
              </PerfectScrollbar>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-8 right-8 rounded-full p-3"
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Ideia</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <Input
              placeholder="Título"
              value={newCard.title}
              onChange={(e) =>
                setNewCard({ ...newCard, title: e.target.value })
              }
            />
            <Textarea
              placeholder="Descrição"
              value={newCard.description}
              onChange={(e) =>
                setNewCard({ ...newCard, description: e.target.value })
              }
            />
            <Select
              value={newCard.subject}
              onValueChange={(value) =>
                setNewCard({ ...newCard, subject: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um assunto" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Criador"
              value={newCard.creator}
              onChange={(e) =>
                setNewCard({ ...newCard, creator: e.target.value })
              }
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={handleAddCard}>Adicionar Ideia</Button>
              <Button
                variant="secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
