// useManagerTable.js

import { useState } from "react";
import axiosInstance from "services/axios";

const useManagerTable = () => {
  const [dados, setDados] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const fetchDados = async () => {
    try {
      const response = await axiosInstance.get(`/storm/ideas`);
      setDados(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do backend:", error);
    }
  };

  const updateStatus = async () => {
    if (!selectedItem || !newStatus) return;
    try {
      await axiosInstance.patch(`/storm/ideas/${selectedItem._id}`, {
        status: newStatus,
      });

      // Notifique o usuário que sua a ideia mudou de status
      await axiosInstance.post(`/notifications`, {
        userId: selectedItem.creator._id,
        type: "idea_status",
        message: `Uma ideia sua foi atualizada para: ${newStatus}.`,
      });

      setDados((prevDados) =>
        prevDados.map((item) =>
          item._id === selectedItem._id ? { ...item, status: newStatus } : item,
        ),
      );
      setIsConfirmOpen(false);
      setSelectedItem(null);
      setNewStatus("");
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  return {
    dados,
    isConfirmOpen,
    selectedItem,
    newStatus,
    fetchDados,
    updateStatus,
    setIsConfirmOpen,
    setSelectedItem,
    setNewStatus,
  };
};

export default useManagerTable;
