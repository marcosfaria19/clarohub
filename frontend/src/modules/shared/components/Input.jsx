import React, { useState } from "react";

const Input = ({ value, onChange, label, required, type, className }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const combinedClassNames = `border border-border rounded pl-3.5 py-2 focus:border-borderHover outline-none transition duration-200 ease-in focus:[box-shadow:0_0_0_0.2rem_rgba(108,117,125,0.25)] ${className}`;
  const floatingLabel = `absolute left-3.5 transition-all duration-150 ease-in-out pointer-events-none ${
    isFocused || value
      ? "text-xs transform -translate-y-2.5 bg-white rounded"
      : "text-base top-4 text-neutral-500"
  }`;

  return (
    <div className="relative w-full">
      <input
        type={type}
        value={value}
        onChange={onChange}
        label={label}
        required={required}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={combinedClassNames}
      />
      <label className={floatingLabel}>{label}</label>
    </div>
  );
};

export default Input;
