import React, { useState, useContext } from "react";
import { ThumbsUp, Trophy, SlidersHorizontal } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import RankingModal from "./RankingModal";
import { AuthContext } from "contexts/AuthContext";
import { useDailyLikes } from "../hooks/useDailyLikes";

export default function StormMenu() {
  const [showRankingModal, setShowRankingModal] = useState(false);
  const { user } = useContext(AuthContext);
  const { remainingLikes } = useDailyLikes(user.userId);

  return (
    <>
      <div className="flex justify-end space-x-2 sm:mx-10 sm:mt-24 lg:mx-10 lg:mt-0">
        <Button variant="ghost" size="icon" className="relative">
          <ThumbsUp className="h-5 w-5" />
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            {remainingLikes}
          </span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowRankingModal(true)}
        >
          <Trophy className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>
      <RankingModal
        isOpen={showRankingModal}
        onClose={() => setShowRankingModal(false)}
      />
    </>
  );
}
