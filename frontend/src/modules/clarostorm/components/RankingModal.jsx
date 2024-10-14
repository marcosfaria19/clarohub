import React from "react";
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

const rankings = [
  {
    position: 1,
    name: "José Cleudes",
    score: 30,
    avatar: "/placeholder-avatar.png",
  },
  {
    position: 2,
    name: "Gabriel L.",
    score: 25,
    avatar: "/placeholder-avatar.png",
  },
  {
    position: 3,
    name: "Pedro L.",
    score: 23,
    avatar: "/placeholder-avatar.png",
  },
  { position: 4, name: "Vinicius Luis", score: 18, avatar: "" },
  { position: 5, name: "Dine Chelly", score: 17, avatar: "" },
  { position: 6, name: "Fares André", score: 12, avatar: "" },
  { position: 10, name: "Guilherme Henrique", score: 8, avatar: "" },
];

export default function RankingModal({ isOpen, onClose }) {
  const podiumOrder = [2, 1, 3];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ranking</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="curtidas" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="curtidas">Curtidas</TabsTrigger>
            <TabsTrigger value="ideias">Ideias</TabsTrigger>
            <TabsTrigger value="apoiadores">Apoiadores</TabsTrigger>
          </TabsList>
          <TabsContent value="curtidas" className="mt-4">
            <div className="mb-6 flex h-48 items-end justify-between">
              {podiumOrder.map((position) => {
                const rank = rankings.find((r) => r.position === position);
                if (!rank) return null;
                return (
                  <div
                    key={rank.position}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`relative w-24 ${position === 1 ? "h-48" : position === 2 ? "h-40" : "h-32"} rounded-t-lg border-2 border-gray-300 bg-gray-200`}
                    >
                      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center p-2">
                        <div className="relative">
                          {position === 1 && (
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
                            src={rank.avatar}
                            alt={rank.name}
                            className="h-12 w-12 rounded-full"
                          />
                        </div>
                        <span className="mt-1 text-sm font-semibold">
                          {rank.name}
                        </span>
                        <span className="text-sm">{rank.score}</span>
                      </div>
                    </div>
                    <div className="-mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 font-bold text-gray-700">
                      {rank.position}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2">
              {rankings.slice(3).map((rank) => (
                <div
                  key={rank.position}
                  className={`flex items-center justify-between p-2 ${rank.position === 10 ? "rounded bg-gray-100" : ""}`}
                >
                  <span>
                    {rank.position}º {rank.name}
                  </span>
                  <span>{rank.score}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="ideias">Content for Ideias tab</TabsContent>
          <TabsContent value="apoiadores">
            Content for Apoiadores tab
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
