import DemandColumn from "./DemandColumn";

const DemandsBoard = ({
  demands,
  members,
  onUnassign,
  isMobile,
  className,
}) => {
  return (
    <div className={`flex-1 bg-background ${className}`}>
      <div
        className={`flex h-full gap-4 py-4 pr-4 ${isMobile ? "flex-col pl-4" : "pl-0"}`}
      >
        {demands.map((demand) => (
          <DemandColumn
            key={demand.id}
            demand={demand}
            members={members}
            onUnassign={onUnassign}
          />
        ))}
      </div>
    </div>
  );
};

export default DemandsBoard;
