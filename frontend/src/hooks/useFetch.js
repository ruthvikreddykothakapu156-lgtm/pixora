import { useState, useEffect, useCallback } from "react";

export function useFetch(fetchFn, deps = [], options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!options.skip);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    if (options.skip) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetchFn();
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, setData, loading, error, refetch };
}