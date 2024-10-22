import { useState, useEffect } from "react";

const useRanking = (type) => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/storm/rankings/${type}`);
        if (!response.ok) {
          throw new Error("Failed to fetch ranking");
        }
        const data = await response.json();
        setRanking(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [type]);

  return { ranking, loading, error };
};

export default useRanking;
