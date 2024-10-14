import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import axiosInstance from "services/axios";

export function useSubjectsAndCards() {
  const [subjects, setSubjects] = useState([]);
  const [cards, setCards] = useState({});
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
            (subject) => subject.nome
          );
          setSubjects(fetchedSubjects);

          const updatedCards = fetchedSubjects.reduce((acc, subject) => {
            acc[subject] = cardsResponse.data.filter(
              (card) => card.subject === subject
            );
            return acc;
          }, {});

          setCards(updatedCards);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError(
          "Falha ao carregar os dados. Por favor, tente novamente mais tarde."
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

  return { subjects, cards, isLoading, error };
}