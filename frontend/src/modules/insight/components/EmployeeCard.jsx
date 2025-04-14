import { UserIcon } from "lucide-react";

const EmployeeCard = ({ employee }) => {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
        {employee.avatar ? (
          <img
            src={employee.avatar || "/placeholder.svg"}
            alt={employee.name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <UserIcon className="h-5 w-5 text-primary-foreground" />
        )}
      </div>
      <div>
        <h4 className="font-medium text-card-foreground">{employee.name}</h4>
        <p className="text-xs text-muted-foreground">{employee.role}</p>
      </div>
    </div>
  );
};

export default EmployeeCard;
