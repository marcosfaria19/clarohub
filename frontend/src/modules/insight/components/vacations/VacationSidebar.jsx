import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "modules/shared/components/ui/card";
import { Avatar, AvatarImage } from "modules/shared/components/ui/avatar";
import { Badge } from "modules/shared/components/ui/badge";
import { Users, Calendar } from "lucide-react";
import { cn } from "modules/shared/lib/utils";
import { formatDate } from "modules/shared/utils/formatDate";
import { formatUserName } from "modules/shared/utils/formatUsername";

import VacationTypeBadge from "./VacationTypeBadge";
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
  const thisMonthVacations = getVacationsForMonth(
    vacations,
    selectedYear,
    selectedMonth,
  );

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden rounded-xl shadow-lg">
        <CardHeader className="pb-3 backdrop-blur-sm">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-4 w-4 text-primary-flow" />
            <span>Este Mês</span>
            <Badge variant="basic" className="ml-2">
              {thisMonthVacations.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {thisMonthVacations.length > 0 ? (
            <div
              className={cn(
                "space-y-3",
                thisMonthVacations.length > 5 &&
                  "max-h-[407px] overflow-y-auto pr-2",
              )}
            >
              {thisMonthVacations.map((vacation) => {
                const employee = formatUserName(vacation.nome);
                return (
                  <div
                    key={vacation.id || vacation._id}
                    className="flex items-center gap-3 rounded-lg p-2 shadow-sm transition-all hover:bg-muted/30"
                  >
                    <div className="relative">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={vacation.avatar || "/placeholder-avatar.png"}
                          alt={employee}
                          className="object-cover"
                        />
                      </Avatar>
                      <div
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background shadow-sm",
                          getUserColor(userColorMap, vacation.nome),
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {employee}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(vacation.startDate, false)} -{" "}
                        {formatDate(vacation.endDate, false)}
                      </p>
                    </div>
                    <VacationTypeBadge type={vacation.type} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/80">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Nenhuma férias este mês
              </p>
            </div>
          )}
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
