import { useState, useEffect, useCallback } from "react";

export function useCatList() {
  const [cats, setCats] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    breed: "Semua",
    age: "Semua",
    gender: "Semua",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        search,
      });
      const response = await fetch(`/api/pets/cats?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch cats");
      }
      const data = await response.json();
      if (data.success) {
        setCats(data.cats);
      } else {
        throw new Error(data.message || "Failed to fetch cats");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, filters]); // `useCallback` mencegah fungsi berubah setiap render

  useEffect(() => {
    fetchCats();
  }, [fetchCats]); // Sekarang aman untuk ditambahkan ke dalam dependency array

  return {
    cats,
    search,
    setSearch,
    filters,
    setFilters,
    loading,
    error,
  };
}
