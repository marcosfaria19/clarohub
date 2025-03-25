import { useState } from "react";
import axiosInstance from "services/axios";

export const useDownloadIdeas = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const downloadIdeas = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      const response = await axiosInstance({
        url: "/spark/ideas/download",
        method: "GET",
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "clarospark_ideas.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
      setError("Failed to download the file. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadIdeas, isDownloading, error };
};
