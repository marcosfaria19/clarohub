import React from "react";
import { Badge } from "modules/shared/components/ui/badge";

export const getTypeConfig = (type) => {
  switch (type?.toLowerCase()) {
    case "vacation":
      return {
        label: "Férias",
        className: "bg-success text-success-foreground",
      };
    case "dayoff":
      return {
        label: "Folga",
        className: "bg-info text-info-foreground",
      };
    default:
      return {
        label: "Férias",
        className: "bg-success text-success-foreground",
      };
  }
};

const VacationTypeBadge = React.memo(({ type }) => {
  const { label, className: typeClassName } = getTypeConfig(type);

  return <Badge className={typeClassName}>{label}</Badge>;
});

export default VacationTypeBadge;
