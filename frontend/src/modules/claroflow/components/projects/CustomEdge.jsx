import React, { useCallback } from "react";
import { BaseEdge, getSmoothStepPath, useReactFlow, useStore } from "reactflow";
import { Button } from "modules/shared/components/ui/button";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}) {
  const { deleteElements } = useReactFlow();
  const edges = useStore((store) => store.edges);

  const [edgePath, edgeCenterX, edgeCenterY] = getSmoothStepPath({
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

  // Utiliza a variável CSS para a cor do traço/fill
  const strokeColor = "hsl(var(--foreground))";

  // ID único para evitar colisões entre múltiplas edges
  const markerEndId = `arrowhead-end-${id}`;

  const edgeStyle = {
    stroke: strokeColor,
    strokeWidth: 1.5,
    markerEnd: `url(#${markerEndId})`,
  };

  return (
    <>
      <defs>
        <marker
          id={markerEndId}
          markerWidth="12"
          markerHeight="9"
          refX="9"
          refY="4.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          {/* Usa style para preencher com a mesma cor dinâmica */}
          <polygon points="0 0, 12 4.5, 0 9" style={{ fill: strokeColor }} />
        </marker>
      </defs>

      <BaseEdge path={edgePath} style={edgeStyle} />

      <foreignObject
        width="40"
        height="40"
        x={edgeCenterX - 20}
        y={edgeCenterY - 20}
        requiredExtensions="http://www.w3.org/1999/xhtml"
        overflow="visible"
      >
        <div className="flex h-full w-full items-center justify-center">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 rounded-full bg-destructive text-white shadow-lg hover:bg-destructive/90"
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
