import React, { useContext } from "react";
import Container from "modules/shared/components/ui/container";
import FlowMenu from "../components/FlowMenu";
import FlowBoard from "../components/FlowBoard";
import { FlowHome } from "../components/FlowHome";
import { AuthContext } from "modules/shared/contexts/AuthContext";
import { useUsers } from "../hooks/useUsers";

export default function Claroflow() {
  const { user } = useContext(AuthContext);
  const userId = user.userId;
  const gestor = user.gestor;

  const { getUserProjectId } = useUsers();
  const projectId = getUserProjectId(userId);

  return (
    <Container innerClassName="max-w-[95vw]">
      <FlowMenu />
      <FlowHome userId={userId} projectId={projectId} gestor={gestor} />
      {/* <FlowBoard /> */}
    </Container>
  );
}
