import { useState, useEffect, useCallback } from "react";
import Pusher from "pusher-js";
import axiosInstance from "services/axios";
import { useLikes } from "./useLikes";

export function useSubjectsAndCards() {
  const [subjects, setSubjects] = useState([]);
  const [cards, setCards] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateLikeCount } = useLikes();

  const updateCardLikes = useCallback(
    (ideaId, newLikesCount, userId, isLiked) => {
      setCards((prevCards) => {
        const updatedCards = { ...prevCards };
        for (const subject in updatedCards) {
          updatedCards[subject] = updatedCards[subject].map((card) => {
            if (card._id === ideaId) {
              const updatedLikedBy = isLiked
                ? [...card.likedBy, userId]
                : card.likedBy.filter((id) => id !== userId);
              return {
                ...card,
                likesCount: newLikesCount,
                likedBy: updatedLikedBy,
              };
            }
            return card;
          });
        }
        return updatedCards;
      });
    },
    [],
  );

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

          const updatedCards = fetchedSubjects.reduce((acc, subject) => {
            acc[subject] = cardsResponse.data.filter(
              (card) => card.subject === subject,
            );
            return acc;
          }, {});

          setCards(updatedCards);
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

    channel.bind("update-likes", function (data) {
      updateCardLikes(data.ideaId, data.likesCount, data.userId, data.isLiked);
      updateLikeCount(data.ideaId, data.likesCount);
    });

    return () => {
      channel.unbind("new-idea");
      channel.unbind("update-likes");
      pusher.unsubscribe("claro-storm");
    };
  }, [updateCardLikes, updateLikeCount]);

  return { subjects, cards, isLoading, error };
}
