import React from "react";
import { Loader } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader className="animate-spin" size={48} />
    </div>
  );
}
