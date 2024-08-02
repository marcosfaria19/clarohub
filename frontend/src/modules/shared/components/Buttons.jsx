// src/components/Button.jsx
import React from "react";

const Button = ({ children, variant, onClick, className, disabled }) => {
  let baseStyle = `align-middle select-none font-semibold text-md text-center transition-all disabled:opacity-50 disabled:grayscale disabled:shadow-none disabled:pointer-events-none py-2 px-3 rounded-lg text-textContent shadow-md shadow-gray-900/10 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none hover:brightness-90 ${className}`;
  let variantStyle = "";

  switch (variant) {
    case "primary":
      variantStyle = "duration-200 bg-primary hover:bg-opacity-90";
      break;
    case "outline-primary":
      variantStyle =
        "duration-200 hover:text-primary border border-gray-100 hover:bg-white";
      break;
    case "outline-dark":
      variantStyle =
        "duration-200 text-dark hover:text-textContent border border-primary hover:bg-primary";
      break;
    case "secondary":
      variantStyle = "bg-secondary ";
      break;
    case "success":
      variantStyle = "bg-success ";
      break;
    case "error":
      variantStyle = "bg-error ";
      break;
    default:
      variantStyle = "duration-200 bg-primary hover:bg-opacity-90";
      break;
  }

  return (
    <button
      className={`${baseStyle} ${variantStyle}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
