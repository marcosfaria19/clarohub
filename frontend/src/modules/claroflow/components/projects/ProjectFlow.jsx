import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, { useNodesState, useEdgesState, Panel } from "reactflow";
import "reactflow/dist/style.css";

import { Button } from "modules/shared/components/ui/button";
import { toast } from "sonner";
import DeleteConfirmationModal from "modules/shared/components/DeleteConfirmationModal";
import useProjects from "modules/claroflow/hooks/useProjects";
import ChangeNotification from "../team/ChangesNotification";
import { getLayoutedElements } from "modules/claroflow/utils/graphLayout";
import AssignmentNode from "./AssignmentNode";
import CustomEdge from "./CustomEdge";

const nodeTypes = { assignment: AssignmentNode };
const edgeTypes = { custom: CustomEdge };

const ProjectFlow = ({ project, onEditAssignment, onDeleteAssignment }) => {
  const { updateTransitions, saveLayout } = useProjects();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentAssignmentId, setCurrentAssignmentId] = useState(null);
  const [initialNodes, setInitialNodes] = useState([]);
  const [initialEdges, setInitialEdges] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  const handleDeleteAssignment = useCallback((assignmentId) => {
    setCurrentAssignmentId(assignmentId);
    setShowDeleteModal(true);
  }, []);

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
            type: "custom",
          })) || [],
      );

      setNodes(newNodes);
      setEdges(newEdges);
      setInitialNodes(newNodes);
      setInitialEdges(newEdges);
    }
  }, [project, onEditAssignment, setNodes, setEdges, handleDeleteAssignment]);

  const handleDeleteConfirm = async () => {
    if (!currentAssignmentId) return;

    try {
      await onDeleteAssignment(project._id, currentAssignmentId);
      toast.success("Demanda excluída!");
    } catch (error) {
      toast.error("Erro ao excluir demanda");
    }
    setShowDeleteModal(false);
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
      } catch {
        toast.error("Erro ao conectar demandas");
      }
    },
    [edges, project._id, updateTransitions, setEdges],
  );

  const onEdgesDelete = useCallback(
    async (deletedEdges) => {
      try {
        for (const edge of deletedEdges) {
          const currentTransitions = edges
            .filter((e) => e.source === edge.source)
            .map((e) => e.target)
            .filter((t) => t !== edge.target);

          await updateTransitions(project._id, edge.source, currentTransitions);
        }
        setHasChanges(true);
      } catch {
        toast.error("Erro ao remover conexão");
      }
    },
    [edges, project._id, updateTransitions],
  );

  const handleLayout = useCallback(() => {
    const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges, "TB");
    setNodes(layoutedNodes);
    setHasChanges(true);
  }, [nodes, edges, setNodes]);

  const handleApplyChanges = useCallback(async () => {
    try {
      await saveLayout(project._id, nodes);
      setInitialNodes(nodes);
      setInitialEdges(edges);
      setHasChanges(false);
    } catch {
      toast.error("Erro ao salvar layout");
    }
  }, [project._id, nodes, edges, saveLayout]);

  const handleDiscardChanges = useCallback(() => {
    setNodes([...initialNodes]);
    setEdges([...initialEdges]);
    setHasChanges(false);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div className="h-full w-full flex-1 bg-card">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
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
        proOptions={{ hideAttribution: true }}
      >
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
