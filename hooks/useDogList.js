import { useState, useEffect, useCallback } from 'react';

export function useDogList() {
  const [dogs, setDogs] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    breed: 'Semua',
    age: 'Semua',
    gender: 'Semua',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        search,
      });
      const response = await fetch(`/api/pets/dogs?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dogs');
      }
      const data = await response.json();
      if (data.success) {
        setDogs(data.dogs);
      } else {
        throw new Error(data.message || 'Failed to fetch dogs');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, search]); // Tambahkan dependencies

  useEffect(() => {
    fetchDogs();
  }, [fetchDogs]); // Tambahkan fetchDogs sebagai dependency

  return {
    dogs,
    search,
    setSearch,
    filters,
    setFilters,
    loading,
    error,
  };
}
