import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "modules/shared/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none justify-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]",
  {
    variants: {
      variant: {
        guest:
          "border-transparent bg-secondary text-secondary-foreground hover:opacity-80",
        basic:
          "border-transparent bg-accent text-accent-foreground hover:bg-accent/80",
        manager:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        admin: "border-transparent bg-black/80 text-white hover:opacity-80",
      },
    },
    defaultVariants: {
      variant: "guest",
    },
  },
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
