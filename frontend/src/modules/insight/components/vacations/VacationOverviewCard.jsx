import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "modules/shared/components/ui/card";
import { Badge } from "modules/shared/components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "modules/shared/components/ui/avatar";
import { CalendarIcon, ArrowRightIcon, Clock, User } from "lucide-react";
import VacationStatusBadge from "./VacationStatusBadge";
import { cn } from "modules/shared/lib/utils";
import {
  capitalizeFirstLetters,
  formatUserName,
} from "modules/shared/utils/formatUsername";
import {
  getDaysUntil,
  getDaysUntilText,
  getDuration,
} from "modules/insight/utils/sortVacation";

const VacationOverviewCard = React.memo(
  ({
    vacation,
    index,
    showDaysUntil = false,
    animate = true,
    variants = null,
  }) => {
    const formatDate = (date) => new Date(date).toLocaleDateString("pt-BR");
    const daysUntil = getDaysUntil(vacation.startDate);
    const isActive = daysUntil <= 0 && getDaysUntil(vacation.endDate) >= 0;
    const duration = getDuration(vacation.startDate, vacation.endDate);

    const cardContent = (
      <Card
        className={cn(
          "transition-colors hover:bg-accent/30",
          isActive && "border-primary/80 bg-primary/5",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-1 items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={vacation.avatar || "/placeholder.svg?height=40&width=40"}
                  alt={vacation.nome}
                />
                <AvatarFallback>
                  {vacation.nome
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">
                      {capitalizeFirstLetters(vacation.nome)}
                    </h3>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      Gestor: {formatUserName(vacation.gestor)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatDate(vacation.startDate)}</span>
                  <ArrowRightIcon className="h-3 w-3" />
                  <span>{formatDate(vacation.endDate)}</span>
                  <Badge className="border-transparent bg-warning text-warning-foreground hover:bg-warning/80">
                    {duration} dia{duration !== 1 ? "s" : ""}
                  </Badge>
                </div>

                {showDaysUntil &&
                  vacation.status === "approved" &&
                  daysUntil >= 0 && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {getDaysUntilText(vacation.startDate)}
                    </div>
                  )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <VacationStatusBadge status={vacation.status} />
            </div>
          </div>
        </CardContent>
      </Card>
    );

    if (animate && variants) {
      return (
        <motion.div
          key={vacation.id || vacation._id || index}
          variants={variants}
        >
          {cardContent}
        </motion.div>
      );
    }

    return cardContent;
  },
);

export default VacationOverviewCard;
