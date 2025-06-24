
import React from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "modules/shared/components/ui/button";

const ErrorFallback = React.memo(({ 
  error, 
  onRetry, 
  title = "Erro ao carregar dados",
  description = "Ocorreu um erro inesperado.",
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`rounded-lg bg-card p-6 shadow-md ${className}`}
    >
      <div className="mb-4 flex items-center text-destructive">
        <AlertCircle className="mr-2 h-6 w-6" />
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <p className="mb-4 text-muted-foreground">
        {description}
      </p>
      {error?.message && (
        <p className="mb-4 text-sm text-muted-foreground">
          Detalhes: {error.message}
        </p>
      )}
      <Button variant="default" onClick={onRetry}>
        Tentar novamente
      </Button>
    </motion.div>
  );
});

ErrorFallback.displayName = "ErrorFallback";

export default ErrorFallback;
