// components/ProjectFlow.jsx
import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import AssignmentNode from "./AssignmentNode";
import { Button } from "modules/shared/components/ui/button";
import { toast } from "sonner";
import DeleteConfirmationModal from "modules/shared/components/DeleteConfirmationModal";

const nodeTypes = { assignment: AssignmentNode };

const ProjectFlow = ({
  project,
  onEditAssignment,
  onDeleteAssignment,
  updateTransitions,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentAssignmentId, setCurrentAssignmentId] = useState(null);

  // Inicializa os nós e conexões
  useEffect(() => {
    if (!project?.assignments) return;

    const initialNodes = project.assignments.map((assignment, index) => ({
      id: assignment._id,
      type: "assignment",
      position: { x: (index * 250) % 1000, y: Math.floor(index / 4) * 150 },
      data: {
        ...assignment,
        onEdit: () => handleEditAssignment(assignment),
        onDelete: () => handleDeleteAssignment(assignment._id),
      },
    }));

    // Conexões baseadas nas transições definidas
    const initialEdges = project.assignments.flatMap(
      (assignment) =>
        assignment.transitions?.map((targetId) => ({
          id: `${assignment._id}-${targetId}`,
          source: assignment._id,
          target: targetId,
          animated: true,
        })) || [],
    );

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [project]);

  const handleEditAssignment = async (assignment) => {
    const newName = prompt("Editar nome da demanda:", assignment.name);
    if (newName && newName !== assignment.name) {
      try {
        await onEditAssignment(project._id, assignment._id, { name: newName });
        toast.success("Demanda atualizada!");
      } catch (error) {
        toast.error("Erro ao atualizar demanda");
      }
    }
  };

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
        setEdges((eds) => addEdge(connection, eds));
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
    } catch (error) {
      toast.error("Erro ao remover conexão");
    }
  };

  return (
    <div className="flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onEdgesDelete={onEdgesDelete}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-right">
          <Button variant="outline" size="sm">
            Ajustar Layout
          </Button>
        </Panel>
      </ReactFlow>
      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ProjectFlow;
