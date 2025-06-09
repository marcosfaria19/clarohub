import React from "react";
import { motion } from "framer-motion";

export function NewIndicator({ isNew }) {
  if (!isNew) return null;
  return (
    <motion.div
      className="absolute inset-0 -m-[1px] overflow-visible rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="h-full w-full rounded-lg"
        style={{
          boxShadow:
            "0 0 0 2px hsl(var(--warning) / 0.5), 0 0 15px hsl(var(--warning) / 0.5)",
        }}
        animate={{
          boxShadow: [
            "0 0 0 2px hsl(var(--warning) / 0.3), 0 0 10px hsl(var(--warning) / 0.3)",
            "0 0 0 2px hsl(var(--warning) / 0.6), 0 0 20px hsl(var(--warning) / 0.6)",
            "0 0 0 2px hsl(var(--warning) / 0.3), 0 0 10px hsl(var(--warning) / 0.3)",
          ],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
      />
      <div
        className="absolute -right-1 -top-1 z-50 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-md"
        style={{
          backgroundColor: "hsl(var(--warning))",
          color: "hsl(var(--warning-foreground))",
        }}
      >
        NOVIDADE
      </div>
    </motion.div>
  );
}

export default NewIndicator;
