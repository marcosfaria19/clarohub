import React from "react";
import { Badge } from "react-bootstrap";
import "./UserBadge.css";

const UserBadge = ({ permission }) => {
  let badgeVariant;
  let icon;

  switch (permission) {
    case "admin":
      badgeVariant = "dark";
      icon = "bi bi-shield-shaded";
      break;
    case "manager":
      badgeVariant = "success";
      icon = "bi bi-bar-chart-fill";
      break;
    case "basic":
      badgeVariant = "primary";
      icon = "bi bi-person-fill";
      break;
    default:
      return null;
  }

  return (
    <Badge
      pill
      bg={badgeVariant}
      className="d-flex align-items-center userBadge"
    >
      <i className={`${icon} me-1`}></i>
      {permission}
    </Badge>
  );
};

export default UserBadge;
