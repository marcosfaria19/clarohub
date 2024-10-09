import * as React from "react";

import { cn } from "modules/shared/lib/utils";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "custom-scrollbar focus-visible:ring-ring flex min-h-[100px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition duration-200 ease-in placeholder:text-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
