
import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const LoadingFallback = React.memo(({ 
  message = "Carregando...", 
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background/50 ${className}`}
    >
      <div className="flex items-center rounded-lg bg-card p-6 shadow-lg">
        <Loader2 className="mr-3 h-6 w-6 animate-spin text-primary" />
        <span className="text-foreground">{message}</span>
      </div>
    </motion.div>
  );
});

LoadingFallback.displayName = "LoadingFallback";

export default LoadingFallback;
