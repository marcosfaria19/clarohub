import React, { useCallback } from "react";
import { BaseEdge, getSmoothStepPath, useReactFlow, useStore } from "reactflow";
import { Button } from "modules/shared/components/ui/button";

export default function BidirectionalEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
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
    nodeHeight: 40,
  });

  const onEdgeClick = useCallback(() => {
    const edgesToDelete = edges.filter(
      (e) => e.id === id || e.id === data.reverseEdgeId,
    );
    deleteElements({ edges: edgesToDelete });
  }, [id, data.reverseEdgeId, edges, deleteElements]);

  // Utiliza a variável CSS para a cor do traço/fill
  const strokeColor = "hsl(var(--primary))";

  // IDs exclusivos para evitar colisões quando vários edges são renderizados
  const markerStartId = `arrowhead-start-${id}`;
  const markerEndId = `arrowhead-end-${id}`;

  const edgeStyle = {
    stroke: strokeColor,
    strokeWidth: 2.0,
    markerStart: `url(#${markerStartId})`,
    markerEnd: `url(#${markerEndId})`,
  };

  return (
    <>
      <defs>
        {/* Setas de início (reversas) */}
        <marker
          id={markerStartId}
          markerWidth="12"
          markerHeight="9"
          refX="3"
          refY="4.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          {/* Polígono invertido */}
          <polygon points="12 0, 0 4.5, 12 9" style={{ fill: strokeColor }} />
        </marker>

        {/* Setas de fim */}
        <marker
          id={markerEndId}
          markerWidth="12"
          markerHeight="9"
          refX="9"
          refY="4.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
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
            title="Remover ambas as conexões"
          >
            ×
          </Button>
        </div>
      </foreignObject>
    </>
  );
}
