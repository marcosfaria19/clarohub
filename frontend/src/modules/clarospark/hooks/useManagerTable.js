import { useState } from "react";
import axiosInstance from "services/axios";
import useNotifications from "modules/shared/hooks/useNotifications";

const useManagerTable = () => {
  const [dados, setDados] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState("");
  const { createUserNotification } = useNotifications();

  const fetchDados = async () => {
    try {
      const response = await axiosInstance.get(`/spark/ideas`);
      setDados(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do backend:", error);
    }
  };

  const changeStatus = async (idea, newStatus, reason) => {
    if (!idea || !newStatus) return;

    try {
      await axiosInstance.patch(`/spark/ideas/${idea._id}`, {
        status: newStatus,
        reason: reason,
      });

      await createUserNotification(
        idea.creator._id,
        "spark",
        `Uma ideia sua foi atualizada para "${newStatus}"`,
      );

      setDados((prevDados) =>
        prevDados.map((item) =>
          item._id === idea._id ? { ...item, status: newStatus } : item,
        ),
      );

      return true;
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      return false;
    }
  };

  return {
    dados,
    isConfirmOpen,
    selectedItem,
    newStatus,
    reason,
    setReason,
    fetchDados,
    changeStatus,
    setIsConfirmOpen,
    setSelectedItem,
    setNewStatus,
  };
};

export default useManagerTable;
