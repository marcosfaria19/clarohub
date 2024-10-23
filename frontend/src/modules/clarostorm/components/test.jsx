const RankingPodium = ({ rank, index, scoreLabel }) => {
    const getBorderColor = () => {
        switch (index) {
            case 0: return "border-yellow-400"; // Gold
            case 1: return "border-gray-400";   // Silver
            case 2: return "border-yellow-600"; // Bronze
            default: return "";
        }
    };

    const getHeight = () => {
        switch (index) {
            case 0: return "h-48 w-32";
            case 1: return "h-40 w-32";
            case 2: return "h-32 w-32";
            default: return "";
        }
    };

    return (
        <div className="flex w-full flex-col items-center">
            <div className={`relative ${getHeight()} rounded-t-lg border-t-4 bg-card/80 ${getBorderColor()}`}>
                <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center p-2">
                    <div className="relative">
                        {index === 0 && (
                            <img src={ouro} className="z-50" alt="Gold medal" />
                        )}
                        <img
                            src={rank.creatorAvatar || rank.avatar || "/placeholder-avatar.png"}
                            alt={rank.creatorName || rank.NOME}
                            className="absolute bottom-6 left-[17px] z-0 h-[85px] w-[90px] rounded-full object-cover"
                        />
                    </div>
                    <span className="mt-1 w-full truncate text-center text-sm font-semibold">
                        {rank.creatorName || rank.NOME}
                    </span>
                    <span className="text-sm">{rank[scoreLabel]}</span>
                </div>
            </div>
        </div>
    );
};
