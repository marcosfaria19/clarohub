import React, { useContext, useEffect, useState } from "react";
import Container from "modules/shared/components/ui/container";
import FlowMenu from "../components/FlowMenu";
import FlowBoard from "../components/FlowBoard";
import { FlowHome } from "../components/FlowHome";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useUsers } from "../hooks/useUsers";

export default function Claroflow() {
  const { user } = useContext(AuthContext);
  const { fetchUserAssignments, getUserProjectId } = useUsers();

  const userId = user.userId;
  const gestor = user.gestor;
  const [projectId, setProjectId] = useState(null);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const project = getUserProjectId(userId);
      const assignments = await fetchUserAssignments(userId);
      setProjectId(project);
      setAssignments(assignments);
    };

    loadData();
  }, [userId, getUserProjectId, fetchUserAssignments]);

  return (
    <Container innerClassName="max-w-[95vw] mb-4 select-none">
      <FlowMenu assignments={assignments} />
      <FlowHome
        userId={userId}
        projectId={projectId}
        gestor={gestor}
        assignments={assignments}
      />
    </Container>
  );
}
