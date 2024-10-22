import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "modules/shared/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "modules/shared/components/ui/tabs";
import axiosInstance from "services/axios";

const useRankings = (type) => {
  // Adiciona o tipo como parâmetro
  const [rankings, setRankings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/storm/rankings/${type}`); // Corrigido para buscar o ranking correto
        setRankings(response.data.rankings);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
    const interval = setInterval(fetchRankings, 300000); // Atualiza a cada 5 minutos
    return () => clearInterval(interval);
  }, [type]); // O fetch depende do tipo

  return { rankings, loading, error };
};

const RankingPodium = ({ rank, index, scoreLabel }) => (
  <div className="flex flex-col items-center">
    <div
      className={`relative w-24 ${
        index === 0 ? "h-48" : index === 1 ? "h-40" : "h-32"
      } rounded-t-lg border-2 border-gray-300 bg-gray-200`}
    >
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center p-2">
        <div className="relative">
          {index === 0 && (
            <svg
              className="absolute -top-6 left-1/2 h-8 w-8 -translate-x-1/2 transform text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2l1.85 3.75 4.15.6-3 2.93.7 4.12L10 11.77 6.3 13.4l.7-4.12-3-2.93 4.15-.6L10 2z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <img
            src={rank.creatorAvatar || rank.avatar || "/placeholder-avatar.png"}
            alt={rank.creatorName || rank.NOME}
            className="h-12 w-12 rounded-full object-cover"
          />
        </div>
        <span className="mt-1 w-full truncate text-center text-sm font-semibold">
          {rank.creatorName || rank.NOME}
        </span>
        <span className="text-sm">{rank[scoreLabel]}</span>
      </div>
    </div>
    <div className="-mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 font-bold text-gray-700">
      {index + 1}
    </div>
  </div>
);

const RankingList = ({ rankings, scoreLabel, userId }) => {
  // Localiza o índice do usuário logado no ranking
  const userIndex = rankings.findIndex((rank) => rank._id === userId);

  // Exibe os 9 primeiros
  const topRankings = rankings.slice(0, 9);

  // Se o usuário estiver além do top 10, adicione o próprio usuário ao final
  const userRanking = userIndex > 9 ? rankings[userIndex] : null; // Se o usuário estiver nos top 9, já será exibido

  return (
    <div className="mt-4 space-y-2">
      {topRankings.map((rank, index) => (
        <div
          key={rank._id}
          className="flex items-center justify-between rounded p-2 transition-colors hover:bg-gray-100"
        >
          <div className="flex items-center">
            <span className="mr-4 w-8 text-right">{index + 1}º</span>
            <img
              src={
                rank.creatorAvatar || rank.avatar || "/placeholder-avatar.png"
              }
              alt={rank.creatorName || rank.NOME}
              className="mr-2 h-8 w-8 rounded-full object-cover"
            />
            <span>{rank.creatorName || rank.NOME}</span>
          </div>
          <span>{rank[scoreLabel]}</span>
        </div>
      ))}
      {userRanking && (
        <>
          <div className="text-center">...</div>
          <div
            key={userRanking._id}
            className="flex items-center justify-between rounded p-2 transition-colors hover:bg-gray-100"
          >
            <div className="flex items-center">
              <span className="mr-4 w-8 text-right">{userIndex + 1}º</span>
              <img
                src={
                  userRanking.creatorAvatar ||
                  userRanking.avatar ||
                  "/placeholder-avatar.png"
                }
                alt={userRanking.creatorName || userRanking.NOME}
                className="mr-2 h-8 w-8 rounded-full object-cover"
              />
              <span>{userRanking.creatorName || userRanking.NOME}</span>
            </div>
            <span>{userRanking[scoreLabel]}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default function RankingModal({ isOpen, onClose, userId }) {
  const [activeTab, setActiveTab] = useState("curtidas");

  const { rankings, loading, error } = useRankings(activeTab); // Usa o tipo de ranking baseado na aba ativa

  const getRankingData = () => {
    if (!rankings) return { data: [], scoreLabel: "" }; // Retorna um array vazio se rankings não estiver definido
    switch (activeTab) {
      case "curtidas":
        return { data: rankings, scoreLabel: "likesCount" };
      case "ideias":
        return { data: rankings, scoreLabel: "ideaCount" };
      case "apoiadores":
        return { data: rankings, scoreLabel: "likeCount" };
      default:
        return { data: [], scoreLabel: "" };
    }
  };

  const { data, scoreLabel } = getRankingData();
  const podiumRankings = data.slice(0, 3); // Como agora data sempre será um array, .slice() funcionará sem erro
  const listRankings = data.slice(3);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ranking</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="curtidas">Curtidas</TabsTrigger>
            <TabsTrigger value="ideias">Ideias</TabsTrigger>
            <TabsTrigger value="apoiadores">Apoiadores</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            {loading ? (
              <div className="text-center">Carregando...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <>
                <div className="mb-6 flex h-48 items-end justify-between">
                  {podiumRankings.map((rank, index) => (
                    <RankingPodium
                      key={rank._id}
                      rank={rank}
                      index={index}
                      scoreLabel={scoreLabel}
                    />
                  ))}
                </div>
                <RankingList
                  rankings={listRankings}
                  scoreLabel={scoreLabel}
                  userId={userId}
                />
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
