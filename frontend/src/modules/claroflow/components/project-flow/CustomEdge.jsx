import { Button } from "modules/shared/components/ui/button";
import { useCallback } from "react";
import { BaseEdge, getBezierPath, useReactFlow } from "reactflow";
import { useStore } from "reactflow";

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
        width="40"
        height="40"
        x={edgeCenterX - 8}
        y={edgeCenterY - 12}
      >
        <Button
          size="icon"
          onClick={onEdgeClick}
          className="h-4 w-4 rounded-full bg-secondary hover:bg-destructive"
        >
          ×
        </Button>
      </foreignObject>
    </>
  );
}
