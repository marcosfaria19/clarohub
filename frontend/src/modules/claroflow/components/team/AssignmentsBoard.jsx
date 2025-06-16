// AssignmentsBoard.jsx
// Componente que renderiza o board de demandas, compondo cada coluna de demanda.
import AssignmentColumn from "./AssignmentColumn";

const AssignmentsBoard = ({
  assignments,
  members,
  onUnassign,
  isMobile,
  className,
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
        {assignments.map((assignment) => (
          <AssignmentColumn
            key={assignment.id}
            assignment={assignment}
            members={members}
            onUnassign={onUnassign}
          />
        ))}
      </div>
    </div>
  );
};

export default AssignmentsBoard;
