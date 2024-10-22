import { useState } from "react";
import axiosInstance from "services/axios";

export function useNewCard(subjects, userId) {
  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
    subject: subjects[0] || "",
    likesCount: 0,
    status: "Em Análise",
    likedBy: [],
    anonimous: 0,
  });

  const handleAddCard = async (cardData) => {
    try {
      const response = await axiosInstance.post("/storm/add-idea", {
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
          anonimous: 0,
        });
        return true;
      }
    } catch (error) {
      console.error("Erro ao adicionar cartão:", error);
      console.log(cardData);
      return false;
    }
  };

  return { newCard, setNewCard, handleAddCard };
}
