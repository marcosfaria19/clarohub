import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "modules/shared/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "modules/shared/components/ui/tabs";
import axiosInstance from "services/axios";
import RankingPodium from "./RankingPodium";
import { DialogTitle } from "@radix-ui/react-dialog";
import RankingList from "./RankingList";

const useRankings = (type) => {
  const [rankings, setRankings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/storm/rankings/${type}`);
        setRankings(response.data.rankings);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
    const interval = setInterval(fetchRankings, 300000);
    return () => clearInterval(interval);
  }, [type]);

  return { rankings, loading, error };
};

export default function RankingModal({ isOpen, onClose, userId }) {
  const [activeTab, setActiveTab] = useState("criadas");

  const { rankings, loading, error } = useRankings(activeTab);

  const getRankingData = () => {
    if (!rankings) return { data: [], score: "" };
    return {
      data: rankings,
      score: "score",
    };
  };

  const { data, score } = getRankingData();
  const podiumRankings = data.slice(0, 3);
  const listRankings = data.slice(3);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:min-h-[650px] sm:max-w-[500px]">
        <DialogTitle className="sr-only">Ranking</DialogTitle>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="criadas">Criadas</TabsTrigger>
            <TabsTrigger value="aprovadas">Aprovadas</TabsTrigger>
            <TabsTrigger value="apoiadores">Apoiadores</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            {loading ? (
              <div className="text-center">Carregando...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <>
                <div className="flex items-end justify-center py-4">
                  <RankingPodium
                    rank={podiumRankings[1]}
                    index={1}
                    scoreLabel={score}
                  />
                  <RankingPodium
                    rank={podiumRankings[0]}
                    index={0}
                    scoreLabel={score}
                  />
                  <RankingPodium
                    rank={podiumRankings[2]}
                    index={2}
                    scoreLabel={score}
                  />
                </div>
                <RankingList
                  rankings={listRankings}
                  scoreLabel={score}
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
