import { useState, useEffect, useCallback, useMemo } from "react";
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
          const cardIndex = updatedCards[subject].findIndex(
            (card) => card._id === ideaId,
          );
          if (cardIndex !== -1) {
            const updatedCard = { ...updatedCards[subject][cardIndex] };
            updatedCard.likesCount = newLikesCount;
            if (isLiked) {
              updatedCard.likedBy = updatedCard.likedBy.filter(
                (id) => id !== userId,
              );
            } else {
              updatedCard.likedBy = [...updatedCard.likedBy, userId];
            }
            updatedCards[subject][cardIndex] = updatedCard;
            break;
          }
        }
        return updatedCards;
      });
    },
    [],
  );

  const sortedCards = useMemo(() => {
    const sorted = {};
    for (const subject in cards) {
      sorted[subject] = [...cards[subject]].sort((a, b) => {
        const likeDiff = b.likedBy.length - a.likedBy.length;
        if (likeDiff === 0) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return likeDiff;
      });
    }
    return sorted;
  }, [cards]);

  useEffect(() => {
    const fetchSubjectsAndCards = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [subjectsResponse, cardsResponse] = await Promise.all([
          axiosInstance.get("/spark/subjects"),
          axiosInstance.get("/spark/ideas"),
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

    const channel = pusher.subscribe("claro-spark");
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
      pusher.unsubscribe("claro-spark");
    };
  }, [updateCardLikes, updateLikeCount]);

  return { subjects, sortedCards, isLoading, error };
}
