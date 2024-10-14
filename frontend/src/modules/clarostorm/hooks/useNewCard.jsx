import { useState } from "react";
import axiosInstance from "services/axios";

export function useNewCard(subjects, initialCreator = "") {
  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
    subject: subjects[0] || "",
    creator: initialCreator,
    likes: 0,
    status: "Em Análise",
  });

  const handleAddCard = async (cardData) => {
    try {
      const response = await axiosInstance.post("/storm/add-idea", cardData);
      if (response.status === 201) {
        setNewCard({
          title: "",
          description: "",
          subject: subjects[0] || "",
          creator: initialCreator,
          likes: 0,
          status: "Em Análise",
        });
        return true;
      }
    } catch (error) {
      console.error("Erro ao adicionar cartão:", error);
      return false;
    }
  };

  return { newCard, setNewCard, handleAddCard };
}