import React from "react";
import Container from "modules/shared/components/ui/container";
import FlowMenu from "../components/FlowMenu";
import FlowBoard from "../components/FlowBoard";
import { FlowHome } from "../components/FlowHome";
import { subjects } from "../utils/flowSubjects";

export default function Claroflow({ userName, userId }) {
  return (
    <Container innerClassName="lg:px-7 lg:mt-2 max-w-[1920px] bg-container">
      <FlowMenu />
      {/* <FlowHome /> */}
      <FlowBoard subjects={subjects} />
    </Container>
  );
}
