export const getDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};
export const sortVacations = (
  vacations,
  sortBy = "date",
  today = new Date(),
) => {
  return [...vacations].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(a.startDate) - new Date(b.startDate);
      case "employee":
        return (a.nome || "").localeCompare(b.nome || "");
      case "duration":
        const aDuration = getDuration(a.startDate, a.endDate);
        const bDuration = getDuration(b.startDate, b.endDate);
        return bDuration - aDuration;
      case "upcoming":
        const aStart = new Date(a.startDate);
        const bStart = new Date(b.startDate);
        const aEnd = new Date(a.endDate);
        const bEnd = new Date(b.endDate);

        // Férias em andamento primeiro
        if (aStart <= today && aEnd >= today) return -1;
        if (bStart <= today && bEnd >= today) return 1;

        // Depois ordena por data de início mais próxima
        return aStart - bStart;
      default:
        return 0;
    }
  });
};

export const getDaysUntil = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getDaysUntilText = (date) => {
  const days = getDaysUntil(date);
  if (days < 0) return "Em andamento";
  if (days === 0) return "Hoje";
  if (days === 1) return "Amanhã";
  return `Em ${days} dias`;
};
