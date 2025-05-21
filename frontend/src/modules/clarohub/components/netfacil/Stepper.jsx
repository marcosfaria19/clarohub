// Diretório: NetSMSFacil/components/Stepper.jsx
import React from "react";
import { Hexagon } from "lucide-react";

export default function Stepper({ currentStep }) {
  return (
    <div className="mt-8 flex justify-center">
      {[0, 1, 2].map((step) => (
        <Hexagon
          key={step}
          className={`mx-1 h-4 w-4 transition-all ${
            currentStep >= step
              ? "fill-primary text-primary"
              : "text-primary/20"
          }`}
        />
      ))}
    </div>
  );
}
