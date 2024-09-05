import React from "react";
import { Badge } from "modules/shared/components/ui/badge";
import { Shield, BarChart, User, UserCheck } from "lucide-react";

const UserBadge = ({ permission }) => {
  let badgeVariant;
  let IconComponent;

  switch (permission) {
    case "admin":
      badgeVariant = "destructive";
      IconComponent = Shield;
      break;
    case "manager":
      badgeVariant = "default";
      IconComponent = BarChart;
      break;
    case "basic":
      badgeVariant = "primary";
      IconComponent = User;
      break;
    case "guest":
      badgeVariant = "secondary";
      IconComponent = UserCheck;
      break;
    default:
      return null;
  }

  return (
    <Badge variant={badgeVariant} className="items-center justify-center">
      <IconComponent className="mr-1 h-4 w-4" />
      <span>{permission}</span>
    </Badge>
  );
};

export default UserBadge;
