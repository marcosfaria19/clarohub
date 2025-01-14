import React from "react";
import ProjectCard from "./ProjectCard";
import { boards } from "../utils/projectNames";

export function FlowHome() {
  return (
    <div className="min-h-[calc(100vh-13rem)] bg-board p-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {boards.map((board) => (
          <ProjectCard key={board.title} {...board} />
        ))}
      </div>
    </div>
  );
}
