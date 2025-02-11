// utils/boardRegistry.js
import GenericBoard from "../components/workflow-boards/GenericBoard";
import OCBoard from "../components/workflow-boards/OCBoard";
import ProjectsBoard from "../components/workflow-boards/ProjectsBoard";

// Mapeamento correto usando IDs individuais
export const BOARD_REGISTRY = {
  "6797dde13552ae3c2dfd0eb2": ProjectsBoard,
  "6797ddde3552ae3c2dfd0eb1": OCBoard,
  default: GenericBoard,
};

// Função de lookup aprimorada
export const getBoardComponent = (assignmentId) => {
  return BOARD_REGISTRY[assignmentId] || BOARD_REGISTRY.default;
};
