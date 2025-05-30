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
import { Badge } from "modules/shared/components/ui/badge";
import { Users, Calendar } from "lucide-react";
import { cn } from "modules/shared/lib/utils";
import { formatDate } from "modules/shared/utils/formatDate";
import { formatUserName } from "modules/shared/utils/formatUsername";

import VacationStatusBadge from "./VacationStatusBadge";
import VacationDetails from "./VacationDetails";
import {
  getUserColor,
  getVacationsForMonth,
} from "modules/insight/utils/vacationUtils";

const VacationSidebar = ({
  vacations,
  selectedYear,
  selectedMonth,
  userColorMap,
  clickedDate,
  clickedDateVacations,
  currentPersonIndex,
  onNavigatePerson,
}) => {
  // Get vacations for the current month
  const thisMonthVacations = getVacationsForMonth(
    vacations,
    selectedYear,
    selectedMonth,
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-4 w-4" />
            Este Mês
            <Badge variant="basic" className="ml-2">
              {thisMonthVacations.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {thisMonthVacations.map((vacation) => {
              const employee = formatUserName(vacation.nome);
              return (
                <div
                  key={vacation.id || vacation._id}
                  className="flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-muted/20"
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          vacation.avatar ||
                          "/placeholder.svg?height=32&width=32"
                        }
                        alt={employee}
                      />
                      <AvatarFallback className="text-xs">
                        {employee
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background",
                        getUserColor(userColorMap, vacation.nome),
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{employee}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(vacation.startDate, false)} -{" "}
                      {formatDate(vacation.endDate, false)}
                    </p>
                  </div>
                  <VacationStatusBadge status={vacation.status} />
                </div>
              );
            })}

            {thisMonthVacations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Calendar className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma férias este mês
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {clickedDate &&
        clickedDateVacations &&
        clickedDateVacations.length > 0 && (
          <VacationDetails
            clickedDateVacations={clickedDateVacations}
            currentPersonIndex={currentPersonIndex}
            userColorMap={userColorMap}
            onNavigatePerson={onNavigatePerson}
          />
        )}
    </div>
  );
};

export default VacationSidebar;
