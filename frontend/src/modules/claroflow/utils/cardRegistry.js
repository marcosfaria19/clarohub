import { MDUAnaliseCard } from "../components/cards/MDUAnaliseCard";

const CARD_REGISTRY = {
  // MDU
  "MDU-Analise": MDUAnaliseCard,
  "MDU-Projeto": MDUAnaliseCard,

  // NAP
  "NAP-Analise": MDUAnaliseCard,

  // Default
  default: MDUAnaliseCard,
};

export const getCardComponent = (projectType, assignmentName) => {
  const key = `${projectType}-${assignmentName}`;
  return CARD_REGISTRY[key] || CARD_REGISTRY.default;
};
