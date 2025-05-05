import { useCallback } from "react";
import { BaseEdge, getBezierPath, useReactFlow, useStore } from "reactflow";
import { Button } from "modules/shared/components/ui/button";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}) {
  const { deleteElements } = useReactFlow();
  const edges = useStore((store) => store.edges);

  const [edgePath, edgeCenterX, edgeCenterY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = useCallback(() => {
    const edgeToDelete = edges.find((edge) => edge.id === id);
    if (edgeToDelete) {
      deleteElements({ edges: [edgeToDelete] });
    }
  }, [id, edges, deleteElements]);

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} />
      <foreignObject
        width="32"
        height="32"
        x={edgeCenterX - 16}
        y={edgeCenterY - 16}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="flex h-full w-full items-center justify-center">
          <Button
            size="icon"
            variant="ghost"
            className="h-4 w-4 rounded-full bg-destructive text-white hover:bg-destructive/90"
            onClick={onEdgeClick}
            title="Remover conexão"
          >
            ×
          </Button>
        </div>
      </foreignObject>
    </>
  );
}
