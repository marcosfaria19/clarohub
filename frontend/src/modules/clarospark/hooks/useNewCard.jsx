import useNotifications from "modules/shared/hooks/useNotifications";
import { useState } from "react";
import axiosInstance from "services/axios";

export function useNewCard(subjects, userId) {
  const { createGlobalNotification } = useNotifications();
  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
    subject: subjects[0] || "",
    likesCount: 0,
    status: "Em Análise",
    likedBy: [],
    anonymous: 0,
  });

  const handleAddCard = async (cardData) => {
    try {
      const response = await axiosInstance.post("/spark/add-idea", {
        ...cardData,
        userId,
      });
      if (response.status === 201) {
        setNewCard({
          title: "",
          description: "",
          subject: subjects[0] || "",
          likesCount: 0,
          status: "Em Análise",
          likedBy: [],
          anonymous: 0,
        });

        await createGlobalNotification(
          "spark",
          "💡 Uma nova ideia foi criada no Spark! Venha conferir.",
        );

        return true;
      }
    } catch (error) {
      console.error("Erro ao adicionar cartão:", error);
      return false;
    }
  };

  return { newCard, setNewCard, handleAddCard };
}
