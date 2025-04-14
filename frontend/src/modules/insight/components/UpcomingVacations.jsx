import { CalendarIcon, UserIcon } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";

const UpcomingVacations = () => {
  // Mock data for upcoming vacations
  const vacations = [
    {
      id: 1,
      employee: "Bruno Araujo",
      startDate: "2024-07-15",
      endDate: "2024-07-30",
      status: "approved",
    },
    {
      id: 2,
      employee: "Daniel Silva",
      startDate: "2024-08-01",
      endDate: "2024-08-15",
      status: "pending",
    },
    {
      id: 3,
      employee: "Eduardo Filho",
      startDate: "2024-08-20",
      endDate: "2024-09-05",
      status: "approved",
    },
    {
      id: 4,
      employee: "Geovana T.",
      startDate: "2024-09-10",
      endDate: "2024-09-25",
      status: "pending",
    },
    {
      id: 5,
      employee: "Isis Lopes",
      startDate: "2024-10-01",
      endDate: "2024-10-15",
      status: "approved",
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status) => {
    return status === "approved"
      ? "bg-success text-success-foreground"
      : "bg-warning text-warning-foreground";
  };

  const getStatusText = (status) => {
    return status === "approved" ? "Aprovado" : "Pendente";
  };

  return (
    <div className="h-96 rounded-lg bg-card p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">
          Próximas Férias
        </h3>
        <Button variant="link" className="text-foreground">
          Ver todos
        </Button>
      </div>

      <div className="h-80 space-y-4 overflow-auto pr-2">
        {vacations.map((vacation) => (
          <div key={vacation.id} className="rounded-lg bg-secondary p-3">
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <UserIcon className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-medium text-card-foreground">
                  {vacation.employee}
                </span>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs ${getStatusColor(vacation.status)}`}
              >
                {getStatusText(vacation.status)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>
                {formatDate(vacation.startDate)} -{" "}
                {formatDate(vacation.endDate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingVacations;
