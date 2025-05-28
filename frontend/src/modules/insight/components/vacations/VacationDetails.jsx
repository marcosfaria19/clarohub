import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "modules/shared/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "modules/shared/components/ui/avatar";
import { Button } from "modules/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "modules/shared/lib/utils";
import {
  formatUserName,
  capitalizeFirstLetters,
} from "modules/shared/utils/formatUsername";
import {
  formatDateRange,
  getUserColor,
} from "modules/insight/utils/vacationUtils";

const VacationDetails = ({
  clickedDateVacations,
  currentPersonIndex,
  userColorMap,
  onNavigatePerson,
}) => {
  if (!clickedDateVacations || clickedDateVacations.length === 0) {
    return null;
  }

  const currentVacation = clickedDateVacations[currentPersonIndex];
  if (!currentVacation) return null;

  const currentPerson = capitalizeFirstLetters(currentVacation.nome);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Detalhes das Férias</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {currentPersonIndex + 1} de {clickedDateVacations.length}
            </span>
            {clickedDateVacations.length > 1 && (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onNavigatePerson("prev")}
                  disabled={currentPersonIndex === 0}
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onNavigatePerson("next")}
                  disabled={
                    currentPersonIndex === clickedDateVacations.length - 1
                  }
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar>
              <AvatarImage
                src={
                  currentVacation.avatar ||
                  "/placeholder.svg?height=40&width=40"
                }
                alt={currentPerson}
              />
              <AvatarFallback>
                {currentPerson
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-background",
                getUserColor(userColorMap, currentVacation.nome),
              )}
            />
          </div>
          <div>
            <p className="font-medium">{currentPerson}</p>
            <p className="text-sm text-muted-foreground">
              Gestor: {formatUserName(currentVacation.gestor)}
            </p>
          </div>
        </div>

        <div className="rounded-md">
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Período:</span>{" "}
              {formatDateRange(
                currentVacation.startDate,
                currentVacation.endDate,
              )}
            </p>

            {currentVacation.notes && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Observações:</span>{" "}
                {currentVacation.notes}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VacationDetails;
