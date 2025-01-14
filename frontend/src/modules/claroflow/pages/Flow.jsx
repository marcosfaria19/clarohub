import React from "react";
import Container from "modules/shared/components/ui/container";
import FlowMenu from "../components/FlowMenu";
import FlowBoard from "../components/FlowBoard";
import { FlowHome } from "../components/FlowHome";

const subjects = [
  "Equipe",
  "Análise",
  "Projeto",
  "Asbuild",
  "Visium",
  "Vistoria",
  "Lode",
  "TP3",
];

export default function Claroflow({ userName, userId }) {
  return (
    <Container innerClassName="lg:px-7 max-w-[1920px] bg-container">
      <FlowMenu />
      {/* <FlowHome /> */}
      <FlowBoard subjects={subjects} />
    </Container>
  );
}
