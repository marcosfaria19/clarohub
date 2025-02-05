import React, { useContext, useEffect, useState } from "react";
import Container from "modules/shared/components/ui/container";
import FlowMenu from "../components/FlowMenu";
import { FlowHome } from "../components/FlowHome";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useUsers } from "../hooks/useUsers";
import ProjectsBoard from "../components/workflow-boards/ProjectsBoard";

export default function Claroflow() {
  const { user } = useContext(AuthContext);
  const { fetchUserAssignments, getUserProjectId } = useUsers();

  const userId = user.userId;
  const gestor = user.gestor;
  const [projectId, setProjectId] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [selectedTab, setSelectedTab] = useState("home");

  useEffect(() => {
    const loadData = async () => {
      const project = await getUserProjectId(userId);
      const assignments = await fetchUserAssignments(userId);
      setProjectId(project);
      setAssignments(assignments);
    };

    loadData();
  }, [userId, getUserProjectId, fetchUserAssignments]);

  return (
    <Container innerClassName="max-w-[95vw] mb-4 select-none">
      <FlowMenu
        assignments={assignments}
        activeTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      <div className="min-h-[75vh] w-full rounded-lg rounded-tr-none bg-board">
        {selectedTab === "home" ? (
          <FlowHome
            userId={userId}
            projectId={projectId}
            gestor={gestor}
            assignments={assignments}
          />
        ) : (
          <ProjectsBoard assignmentId={selectedTab} projectId={projectId} />
        )}
      </div>
    </Container>
  );
}
