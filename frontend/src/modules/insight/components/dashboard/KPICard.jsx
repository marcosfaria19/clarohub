import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Clock, BarChart } from "lucide-react";
import { Card, CardContent } from "modules/shared/components/ui/card";

// Componente reutilizável para cards de KPI animados
const KPICard = React.memo(
  ({
    title,
    value,
    unit,
    trend = "neutral",
    trendValue = 0,
    previousValue,
    deviation,
    period,
    icon,
    className = "",
  }) => {
    const controls = useAnimation();

    // Animação do valor
    useEffect(() => {
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.5 },
      });
    }, [value, controls]);

    // Determinar a cor baseada na tendência
    const getTrendColor = () => {
      if (trend === "up") return "text-success";
      if (trend === "down") return "text-destructive";
      return "text-muted";
    };

    // Ícone baseado na tendência
    const getTrendIcon = () => {
      if (trend === "up") return "↑";
      if (trend === "down") return "↓";
      return "→";
    };

    // Renderizar o ícone apropriado do Lucide
    const renderIcon = () => {
      switch (icon) {
        case "clock":
          return <Clock className="h-6 w-6" />;
        case "chart-bar":
          return <BarChart className="h-6 w-6" />;
        default:
          return null;
      }
    };

    return (
      <motion.div
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`p-5 hover:shadow-lg ${className}`}>
          <div className="mb-4 flex items-start justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              {title}
            </h3>
            <div className="text-primary">{renderIcon()}</div>
          </div>

          <CardContent className="p-0">
            <div className="flex items-baseline">
              <motion.div
                className="text-3xl font-bold text-foreground"
                animate={controls}
              >
                {value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
              </motion.div>
              <span className="ml-1 text-sm text-muted-foreground">{unit}</span>

              {deviation && (
                <span className="ml-2 text-sm text-muted-foreground">
                  ±
                  {deviation.toLocaleString("pt-BR", {
                    maximumFractionDigits: 1,
                  })}
                </span>
              )}
            </div>

            {trend !== "neutral" && trendValue > 0 && (
              <div className="mt-2 flex items-center">
                <motion.span
                  className={`text-sm font-medium ${getTrendColor()}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {getTrendIcon()} {trendValue}%
                </motion.span>

                {previousValue && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    vs{" "}
                    {previousValue.toLocaleString("pt-BR", {
                      maximumFractionDigits: 1,
                    })}{" "}
                    {unit}
                  </span>
                )}
              </div>
            )}

            {period && (
              <div className="mt-1 text-xs text-muted-foreground">
                Por {period}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  },
);

KPICard.displayName = "KPICard";

export default KPICard;
