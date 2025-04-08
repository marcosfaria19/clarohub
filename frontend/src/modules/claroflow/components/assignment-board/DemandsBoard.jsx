// DemandsBoard.jsx
// Componente que renderiza o board de demandas, compondo cada coluna de demanda.
import DemandColumn from "./DemandColumn";

const DemandsBoard = ({
  demands,
  members,
  onUnassign,
  isMobile,
  className,
  onUpdateRegional,
}) => {
  return (
    <div className={`flex-1 bg-background ${className}`}>
      {/* Container que organiza as colunas, com layout diferente para mobile */}
      <div
        className={`flex h-full gap-4 py-4 pr-4 ${
          isMobile
            ? "flex-col overflow-y-auto pl-4"
            : "flex-row flex-wrap overflow-y-auto pl-0"
        }`}
      >
        {demands.map((demand) => (
          <DemandColumn
            key={demand.id}
            demand={demand}
            members={members}
            onUnassign={onUnassign}
            onUpdateRegional={onUpdateRegional}
          />
        ))}
      </div>
    </div>
  );
};

export default DemandsBoard;
