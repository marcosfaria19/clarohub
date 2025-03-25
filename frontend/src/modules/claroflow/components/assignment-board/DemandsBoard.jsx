import DemandColumn from "./DemandColumn";

const DemandsBoard = ({ demands, members, onUnassign, isMobile }) => {
  return (
    <div className="scrollbar-spark flex flex-1 flex-col overflow-auto bg-background pl-4">
      <div className={`flex gap-4 ${isMobile && "flex-col"}`}>
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
