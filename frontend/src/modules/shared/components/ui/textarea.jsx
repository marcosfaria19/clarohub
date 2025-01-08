import * as React from "react";

import { cn } from "modules/shared/lib/utils";

const Textarea = React.forwardRef(({ className, maxLength, ...props }, ref) => {
  const [charCount, setCharCount] = React.useState(0);
  const textareaRef = React.useRef(null);

  React.useEffect(() => {
    if (ref) {
      if (typeof ref === "function") {
        ref(textareaRef.current);
      } else {
        ref.current = textareaRef.current;
      }
    }
    // Inicialize o charCount com o comprimento do valor inicial
    setCharCount(props.value ? props.value.length : 0);
  }, [ref, props.value]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setCharCount(inputValue.length);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className={cn("relative w-full", maxLength && "pb-3")}>
      <textarea
        className={cn(
          "focus-visible:ring-ring flex min-h-[100px] w-full resize-none items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition duration-200 ease-in placeholder:text-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          maxLength,
          className,
        )}
        ref={textareaRef}
        onChange={handleChange}
        maxLength={maxLength}
        {...props}
      />
      {maxLength && (
        <div className="absolute bottom-[-10px] right-0 bg-transparent px-1 text-[12px] text-[#76797e]">
          {charCount}/{maxLength} caracteres
        </div>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
