import * as React from "react";
import { cn } from "modules/shared/lib/utils";

const Input = React.forwardRef(
  ({ className, type, label, floating, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const combinedClassNames = cn(
      "border rounded pl-3.5 focus:border-borderHover outline-none transition duration-200 ease-in focus:[box-shadow:0_0_0_0.2rem_rgba(108,117,125,0.25)] select-none",
      floating
        ? "placeholder-transparent"
        : "focus:placeholder-muted placeholder-black",

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
      <>
        <input
          type={type}
          className={combinedClassNames}
          placeholder={label}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {floating && <label className={floatingLabelClasses}>{label}</label>}
      </>
    );
  },
);

Input.displayName = "Input";

export { Input };
