import React, { useState } from "react";

const Select = ({ label, id, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="relative w-full">
      <input
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(value !== "")}
        className="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 top-2 text-gray-500 transition-all duration-200 transform origin-left ${
          isFocused || value
            ? "-translate-y-6 scale-75 text-blue-500"
            : "translate-y-0 scale-100"
        } peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-500`}
      >
        {label}
      </label>
    </div>
  );
};

export default Select;
