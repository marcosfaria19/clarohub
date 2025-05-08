import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import { Badge } from "modules/shared/components/ui/badge";
import { Button } from "modules/shared/components/ui/button";
import { UserIcon, CheckIcon, XIcon, CalendarIcon } from "lucide-react";

const PendingVacations = ({ vacations, onApprove, onReject }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Férias Pendentes</CardTitle>
        <CardDescription>
          {vacations.length} solicitações aguardando aprovação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {vacations.map((vacation) => (
              <div key={vacation.id} className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${vacation.color}`}
                    >
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">{vacation.employee}</h4>
                      <p className="text-sm text-muted-foreground">
                        {vacation.department}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-yellow-500 text-yellow-500"
                  >
                    Pendente
                  </Badge>
                </div>

                <div className="mb-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Data Inicial</p>
                    <p className="font-medium">
                      {formatDate(vacation.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Data Final</p>
                    <p className="font-medium">
                      {formatDate(vacation.endDate)}
                    </p>
                  </div>
                </div>

                {vacation.notes && (
                  <div className="mb-4 rounded-md bg-secondary p-2 text-sm">
                    <p className="text-xs font-medium text-muted-foreground">
                      Observações:
                    </p>
                    <p>{vacation.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="w-full gap-1 bg-green-500 hover:bg-green-600"
                    onClick={() => onApprove(vacation.id)}
                  >
                    <CheckIcon className="h-4 w-4" />
                    Aprovar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={() => onReject(vacation.id)}
                  >
                    <XIcon className="h-4 w-4" />
                    Rejeitar
                  </Button>
                </div>
              </div>
            ))}

            {vacations.length === 0 && (
              <div className="flex h-[300px] flex-col items-center justify-center text-center text-muted-foreground">
                <CalendarIcon className="mb-2 h-12 w-12 opacity-20" />
                <h3 className="text-lg font-medium">
                  Nenhuma solicitação pendente
                </h3>
                <p className="max-w-xs text-sm">
                  Todas as solicitações de férias foram processadas.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PendingVacations;
