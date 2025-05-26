import React from "react";
import { Badge } from "modules/shared/components/ui/badge";

import { motion } from "framer-motion";

const VacationStatusBadge = React.memo(
  ({ status, className = "", animate = true }) => {
    const getStatusConfig = () => {
      switch (status) {
        case "APPROVED":
          return {
            label: "Aprovado",
            className: "bg-success text-success-foreground hover:bg-success/80",
            variants: {
              initial: { scale: 0.8, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              hover: { scale: 1.05 },
            },
          };
        case "PENDING":
          return {
            label: "Pendente",
            className: "bg-warning text-warning-foreground hover:bg-warning/80",
            variants: {
              initial: { scale: 0.8, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              hover: { scale: 1.05 },
            },
          };
        case "REJECTED":
          return {
            label: "Rejeitado",
            className:
              "bg-destructive text-destructive-foreground hover:bg-destructive/80",
            variants: {
              initial: { scale: 0.8, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              hover: { scale: 1.05 },
            },
          };
        case "CANCELED":
          return {
            label: "Cancelado",
            className:
              "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            variants: {
              initial: { scale: 0.8, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              hover: { scale: 1.05 },
            },
          };
        default:
          return {
            label: "Desconhecido",
            className: "bg-muted text-muted-foreground",
            variants: {
              initial: { scale: 0.8, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              hover: { scale: 1.05 },
            },
          };
      }
    };

    const { label, className: statusClassName, variants } = getStatusConfig();

    if (animate) {
      return (
        <motion.div
          initial="initial"
          animate="animate"
          whileHover="hover"
          variants={variants}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Badge className={`${statusClassName} ${className}`}>{label}</Badge>
        </motion.div>
      );
    }

    return <Badge className={`${statusClassName} ${className}`}>{label}</Badge>;
  },
);

VacationStatusBadge.displayName = "VacationStatusBadge";

export default VacationStatusBadge;
