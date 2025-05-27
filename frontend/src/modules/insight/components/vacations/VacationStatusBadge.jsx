import React from "react";
import { Badge } from "modules/shared/components/ui/badge";

export const getStatusConfig = (status) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return {
        label: "Aprovado",
        className: "bg-success text-success-foreground",
      };
    case "pending":
      return {
        label: "Pendente",
        className: "bg-warning text-warning-foreground",
      };
    case "rejected":
      return {
        label: "Rejeitado",
        className: "bg-destructive text-destructive-foreground",
      };
    case "canceled":
      return {
        label: "Cancelado",
        className: "bg-secondary text-secondary-foreground",
      };
    default:
      return {
        label: "Aprovado",
        className: "bg-success text-success-foreground",
      };
  }
};

const VacationStatusBadge = React.memo(({ status }) => {
  const { label, className: statusClassName } = getStatusConfig(status);

  return <Badge className={statusClassName}>{label}</Badge>;
});

export default VacationStatusBadge;
