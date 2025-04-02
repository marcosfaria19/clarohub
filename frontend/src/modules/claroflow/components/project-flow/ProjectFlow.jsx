import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import AssignmentNode from "./AssignmentNode";
import { Button } from "modules/shared/components/ui/button";
import { toast } from "sonner";
import DeleteConfirmationModal from "modules/shared/components/DeleteConfirmationModal";
import useProjects from "modules/claroflow/hooks/useProjects";
import ChangeNotification from "../assignment-board/ChangesNotification";

const nodeTypes = { assignment: AssignmentNode };
const nodeWidth = 256;
const nodeHeight = 128;

const getLayoutedElements = (nodes, edges, direction = "TB") => {
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

const ProjectFlow = ({ project, onEditAssignment, onDeleteAssignment }) => {
  const { updateTransitions, saveLayout } = useProjects();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentAssignmentId, setCurrentAssignmentId] = useState(null);
  const [initialNodes, setInitialNodes] = useState([]);
  const [initialEdges, setInitialEdges] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (project?.assignments) {
      const newNodes = project.assignments.map((assignment) => ({
        id: assignment._id,
        type: "assignment",
        position: assignment.position || { x: 0, y: 0 },
        data: {
          ...assignment,
          onEdit: () => onEditAssignment(assignment),
          onDelete: () => handleDeleteAssignment(assignment._id),
        },
      }));

      const newEdges = project.assignments.flatMap(
        (assignment) =>
          assignment.transitions?.map((targetId) => ({
            id: `${assignment._id}-${targetId}`,
            source: assignment._id,
            target: targetId,
            animated: true,
          })) || [],
      );

      // Verifica mudanças nos nós
      const nodesChanged =
        newNodes.length !== nodes.length ||
        newNodes.some((newNode, index) => {
          const oldNode = nodes[index];
          return (
            newNode.id !== oldNode.id ||
            newNode.position.x !== oldNode.position.x ||
            newNode.position.y !== oldNode.position.y
          );
        });

      // Verifica mudanças nas edges
      const edgesChanged =
        newEdges.length !== edges.length ||
        newEdges.some((newEdge, index) => {
          const oldEdge = edges[index];
          return (
            newEdge.source !== oldEdge.source ||
            newEdge.target !== oldEdge.target
          );
        });

      if (nodesChanged || edgesChanged) {
        setNodes(newNodes);
        setEdges(newEdges);
        setInitialNodes(newNodes);
        setInitialEdges(newEdges);
        setHasChanges(false);
      }
    }
  }, [project]);

  useEffect(() => {
    setHasChanges(false);
  }, [project?._id]);

  const handleDeleteAssignment = (assignmentId) => {
    setCurrentAssignmentId(assignmentId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (currentAssignmentId) {
      try {
        await onDeleteAssignment(project._id, currentAssignmentId);
        toast.success("Demanda excluída!");
      } catch (error) {
        toast.error("Erro ao excluir demanda");
      }
      setShowDeleteModal(false);
    }
  };

  const onConnect = useCallback(
    async (connection) => {
      try {
        await updateTransitions(project._id, connection.source, [
          ...edges
            .filter((e) => e.source === connection.source)
            .map((e) => e.target),
          connection.target,
        ]);
        setEdges((eds) => [...eds, connection]);
        setHasChanges(true);
      } catch (error) {
        toast.error("Erro ao conectar demandas");
      }
    },
    [edges, project._id, updateTransitions],
  );

  const onEdgesDelete = async (deletedEdges) => {
    try {
      for (const edge of deletedEdges) {
        const currentTransitions = edges
          .filter((e) => e.source === edge.source)
          .map((e) => e.target)
          .filter((t) => t !== edge.target);

        await updateTransitions(project._id, edge.source, currentTransitions);
      }
      setHasChanges(true);
    } catch (error) {
      toast.error("Erro ao remover conexão");
    }
  };

  const handleLayout = useCallback(() => {
    const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges, "TB");
    setNodes(layoutedNodes);
    setHasChanges(true);
  }, [nodes]);

  const handleApplyChanges = async () => {
    try {
      await saveLayout(project._id, nodes);
      setInitialNodes(nodes);
      setInitialEdges(edges);
      setHasChanges(false);
      /* toast.success("Layout salvo!"); */
    } catch (error) {
      toast.error("Erro ao salvar layout");
    }
  };

  const handleDiscardChanges = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setHasChanges(false);
  };

  return (
    <div className="flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => {
          onNodesChange(changes);
          setHasChanges(true);
        }}
        onEdgesChange={(changes) => {
          onEdgesChange(changes);
          setHasChanges(true);
        }}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-right">
          <Button variant="outline" size="sm" onClick={handleLayout}>
            Ajustar Layout
          </Button>
        </Panel>
      </ReactFlow>

      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleDeleteConfirm={handleDeleteConfirm}
      />

      <ChangeNotification
        hasChanges={hasChanges}
        onApply={handleApplyChanges}
        onDiscard={handleDiscardChanges}
      />
    </div>
  );
};

export default ProjectFlow;
