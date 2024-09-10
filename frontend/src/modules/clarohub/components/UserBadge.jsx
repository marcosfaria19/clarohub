import React from "react";
import { Badge } from "modules/shared/components/ui/badge";
import { Shield, BarChart, User, UserCheck } from "lucide-react";

const UserBadge = ({ permission }) => {
  let IconComponent;

  switch (permission) {
    case "admin":
      IconComponent = Shield;
      break;
    case "manager":
      IconComponent = BarChart;
      break;
    case "basic":
      IconComponent = UserCheck;
      break;
    case "guest":
      IconComponent = User;
      break;
    default:
      return null;
  }

  return (
    <Badge
      variant={permission}
      className="flex w-24 items-center justify-center"
    >
      <IconComponent className="mr-1 h-4 w-4" />
      <span>{permission}</span>
    </Badge>
  );
};

export default UserBadge;
