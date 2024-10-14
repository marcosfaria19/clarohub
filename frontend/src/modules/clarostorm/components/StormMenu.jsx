import React, { useState } from "react";
import { ThumbsUp, Trophy, SlidersHorizontal } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";
import RankingModal from "./RankingModal";

export default function StormMenu() {
  const [showRankingModal, setShowRankingModal] = useState(false);

  return (
    <>
      <div className="flex justify-end space-x-2 sm:mx-10 sm:mt-24 lg:mx-10 lg:mt-0">
        <Button variant="ghost" size="icon">
          <ThumbsUp className="h-5 w-5" />
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
