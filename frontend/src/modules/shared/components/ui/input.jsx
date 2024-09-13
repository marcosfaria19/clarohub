import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "modules/shared/lib/utils";

const inputVariants = cva(
  "border rounded pl-3 outline-none transition duration-200 ease-in select-none",
  {
    variants: {
      variant: {
        login:
          "focus:border-borderHover focus:[box-shadow:0_0_0_0.2rem_rgba(108,117,125,0.25)] placeholder-black ",
        default:
          "flex w-full items-center justify-between rounded-md border border-popover bg-menu px-3 py-2 text-sm text-foreground/90 ring-offset-muted placeholder:text-foreground/90 focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 focus:placeholder-foreground/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Input = React.forwardRef(
  ({ className, type, label, floating, variant, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const combinedClassNames = cn(
      inputVariants({ variant }),
      floating ? "placeholder-transparent" : "",
      className,
    );

    const floatingLabelClasses = cn(
      "absolute left-3.5 top-3 transition-all duration-150 ease-in-out pointer-events-none",
      {
        "text-xs transform -translate-y-6 bg-foreground rounded px-1 text-popover":
          isFocused || props.value,
      },
    );

    return (
      <div className="relative">
        <input
          type={type}
          className={combinedClassNames}
          placeholder={label}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
          ref={ref}
        />
        {floating && <label className={floatingLabelClasses}>{label}</label>}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants };
