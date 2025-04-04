// src/utils/graphLayout.js
import dagre from "dagre";

// Constants
export const nodeWidth = 256;
export const nodeHeight = 128;

// Layout function
export const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const dagreNode = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: dagreNode.x - nodeWidth / 2,
          y: dagreNode.y - nodeHeight / 2,
        },
      };
    }),
    edges,
  };
};
