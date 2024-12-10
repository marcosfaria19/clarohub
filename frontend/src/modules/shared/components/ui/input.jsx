import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "modules/shared/lib/utils";
import { useState } from "react";

const inputVariants = cva(
  "border rounded pl-3 outline-none transition duration-200 ease-in select-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]",
  {
    variants: {
      variant: {
        login:
          "focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder-black",
        default:
          "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Input = React.forwardRef(
  ({ className, type, label, floating, variant, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isAutoFilled, setIsAutoFilled] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const handleAutoFill = () => setIsAutoFilled(true);

    const combinedClassNames = cn(
      inputVariants({ variant }),
      floating ? "placeholder-transparent" : "",
      className,
    );

    const floatingLabelClasses = cn(
      "absolute left-3.5 top-3 transition-all duration-150 ease-in-out pointer-events-none text-black",
      {
        "text-xs transform -translate-y-6 bg-white rounded px-1 text-black":
          isFocused || props.value || isAutoFilled,
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
          onAnimationStart={(e) => {
            if (e.animationName === "onAutoFillStart") {
              handleAutoFill();
            }
          }}
          {...props}
          ref={ref}
          translate="no"
        />
        {floating && <label className={floatingLabelClasses}>{label}</label>}
        <style jsx>{`
          @keyframes onAutoFillStart {
            from {
              /**/
            }
            to {
              /**/
            }
          }
          input:-webkit-autofill {
            animation-name: onAutoFillStart;
          }
        `}</style>
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants };
