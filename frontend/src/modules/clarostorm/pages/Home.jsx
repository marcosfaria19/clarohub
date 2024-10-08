import { Download, SlidersHorizontal, ThumbsUp, Trophy } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import Pusher from "pusher-js"; // Importe o Pusher da biblioteca instalada
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import { useEffect, useState } from "react"; // Importar useState
import axiosInstance from "services/axios"; // Ajuste o caminho conforme necessário

const ClaroStorm = () => {
  const [cards, setCards] = useState([]); // Estado para armazenar os cartões
  const [newCard, setNewCard] = useState(""); // Estado para novo cartão

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axiosInstance.get("/cards"); // Requisição para obter cartões
        if (response.status === 200) {
          setCards(response.data); // Atualiza o estado com os cartões obtidos
        }
      } catch (error) {
        console.error("Erro ao buscar cartões:", error);
      }
    };

    fetchCards(); // Chama a função para buscar os cartões

    // Configure o Pusher aqui
    Pusher.logToConsole = true;

    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: process.env.REACT_APP_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe("kanban-channel");
    channel.bind("new-card", function (data) {
      setCards((prevCards) => [...prevCards, data.card]); // Atualiza o estado com o novo cartão recebido
    });

    // Cleanup ao desmontar o componente
    return () => {
      channel.unbind("new-card");
      pusher.unsubscribe("kanban-channel");
    };
  }, []); // O array vazio garante que o useEffect rode apenas uma vez

  const handleAddCard = async () => {
    if (!newCard) return; // Verifica se o campo está vazio

    try {
      const response = await axiosInstance.post("/add-card", {
        text: newCard, // Ajuste conforme seu modelo de dados
      });

      if (response.status === 201) {
        setNewCard(""); // Limpar o campo de entrada
      }
    } catch (error) {
      console.error("Erro ao adicionar cartão:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1920px] px-4 py-28 sm:px-6 sm:py-28 md:px-8 md:py-28 lg:px-12 lg:py-24">
        <div className="mb-2 flex justify-end gap-4">
          <Button variant="ghost">
            <ThumbsUp />
          </Button>
          <Button variant="ghost">
            <Trophy />
          </Button>
          <Button variant="ghost">
            <SlidersHorizontal />
          </Button>
          <Button variant="ghost">
            <Download />
          </Button>
        </div>

        {/* Formulário para adicionar um novo cartão */}
        <div className="mb-4">
          <input
            type="text"
            value={newCard}
            onChange={(e) => setNewCard(e.target.value)}
            placeholder="Adicionar novo cartão..."
            className="rounded border border-gray-300 p-2"
          />
          <Button onClick={handleAddCard} variant="primary">
            Adicionar Cartão
          </Button>
        </div>

        {/* Renderizando os cartões */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{card.text}</CardTitle>{" "}
                {/* Ajuste conforme seu modelo de dados */}
              </CardHeader>
              <CardContent>
                <p>{card.text}</p> {/* Ajuste conforme seu modelo de dados */}
              </CardContent>
              <CardFooter>
                <Button variant="ghost">Curtir</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClaroStorm;
