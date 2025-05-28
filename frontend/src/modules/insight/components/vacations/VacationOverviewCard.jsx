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
    isCompact = false,
    animate = true,
    className = "",
    variants = null,
  }) => {
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("pt-BR");
    };

    const daysUntil = getDaysUntil(vacation.startDate);
    const isActive = daysUntil <= 0 && getDaysUntil(vacation.endDate) >= 0;
    const duration = getDuration(vacation.startDate, vacation.endDate);

    const cardContent = (
      <Card
        className={cn(
          isActive && "border-primary/80 bg-primary/5",
          !isCompact && "transition-shadow hover:shadow-md",
          isCompact && "transition-colors hover:bg-accent/50",
          className,
        )}
      >
        <CardContent className={cn("p-4", isCompact && "p-3")}>
          <div
            className={cn(
              "flex items-start justify-between",
              isCompact && "flex items-center gap-4",
            )}
          >
            <div
              className={cn(
                "flex items-start gap-3",
                isCompact && "flex-1 space-y-1",
              )}
            >
              <Avatar className={cn("h-10 w-10", isCompact && "h-8 w-8")}>
                <AvatarImage
                  src={vacation.avatar || "/placeholder.svg?height=40&width=40"}
                  alt={vacation.nome}
                />
                <AvatarFallback className={isCompact ? "text-xs" : ""}>
                  {vacation.nome
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className={cn("space-y-1", isCompact && "flex-1")}>
                <div
                  className={cn(
                    isCompact && "flex items-center justify-between",
                  )}
                >
                  <div>
                    <h3
                      className={cn(
                        "font-medium",
                        isCompact ? "text-sm" : "text-base",
                      )}
                    >
                      {capitalizeFirstLetters(vacation.nome)}
                    </h3>
                    <p
                      className={cn(
                        "flex items-center gap-1 text-muted-foreground",
                        isCompact ? "text-xs" : "text-sm",
                      )}
                    >
                      <User className="h-3 w-3" />
                      Gestor: {formatUserName(vacation.gestor)}
                    </p>
                  </div>
                  {isCompact && (
                    <VacationStatusBadge status={vacation.status} />
                  )}
                </div>

                <div
                  className={cn(
                    "flex items-center gap-2 text-muted-foreground",
                    isCompact ? "text-xs" : "text-sm",
                  )}
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatDate(vacation.startDate)}</span>
                  <ArrowRightIcon className="h-3 w-3" />
                  <span>{formatDate(vacation.endDate)}</span>
                  <Badge
                    className={cn(
                      "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
                      isCompact && "text-xs",
                    )}
                  >
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

            {!isCompact && (
              <div className="flex flex-col items-end gap-2">
                <VacationStatusBadge status={vacation.status} />
              </div>
            )}
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
