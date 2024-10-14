import React from "react";

export default function ErrorDisplay({ message }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-red-500">{message}</p>
    </div>
  );
}
