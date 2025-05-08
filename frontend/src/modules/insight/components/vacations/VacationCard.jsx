import { Badge } from "modules/shared/components/ui/badge";
import { Button } from "modules/shared/components/ui/button";
import {
  CalendarIcon,
  InfoIcon,
  UserIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";

const VacationCard = ({ vacation, onApprove, onReject }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const formatDateRange = (start, end) => {
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <div className="rounded-lg bg-secondary p-3">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${vacation.color}`}
          >
            <UserIcon className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-medium text-card-foreground">
              {vacation.employee}
            </span>
            <div className="text-xs text-muted-foreground">
              {vacation.department}
            </div>
          </div>
        </div>
        <Badge
          variant={vacation.status === "approved" ? "default" : "outline"}
          className={`${
            vacation.status === "approved"
              ? "bg-green-500 hover:bg-green-500/80"
              : "border-yellow-500 text-yellow-500"
          }`}
        >
          {vacation.status === "approved" ? "Aprovado" : "Pendente"}
        </Badge>
      </div>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <CalendarIcon className="h-4 w-4" />
        <span>{formatDateRange(vacation.startDate, vacation.endDate)}</span>
      </div>
      {vacation.notes && (
        <div className="mt-2 flex items-start gap-1 text-xs text-muted-foreground">
          <InfoIcon className="h-3 w-3 shrink-0 translate-y-0.5" />
          <span>{vacation.notes}</span>
        </div>
      )}
      <div className="mt-3 flex gap-2">
        {vacation.status === "pending" ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-full gap-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              onClick={() => onApprove(vacation.id)}
            >
              <CheckIcon className="h-3 w-3" />
              Aprovar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-full gap-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => onReject(vacation.id)}
            >
              <XIcon className="h-3 w-3" />
              Rejeitar
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm" className="h-8 w-full">
            Ver detalhes
          </Button>
        )}
      </div>
    </div>
  );
};

export default VacationCard;
