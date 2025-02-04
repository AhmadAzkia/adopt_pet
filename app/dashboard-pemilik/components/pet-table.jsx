'use client';

import { useState, useEffect } from 'react';

export function PetTable({ pets, onDelete, onStatusChange }) {
  // Move initial state to useEffect to avoid hydration mismatch
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({
    status: 'all',
    type: 'all',
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(search.toLowerCase()) ||
      pet.breed.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filter.status === 'all' ||
      (filter.status === 'adopted' && pet.adopted === 1) ||
      (filter.status === 'available' && pet.adopted === 0);

    const matchesType = filter.type === 'all' || filter.type === pet.type;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Don't render until client-side hydration is complete
  if (!mounted) {
    return null;
  }

  const getPetTypeLabel = (type) => {
    return type === 'cat' ? 'Kucing' : 'Anjing';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Cari nama atau ras..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-secondary focus:ring-2 transition-all duration-300 bg-white/50 backdrop-blur-sm text-cmuda"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-cmuda"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="flex gap-4">
          <select
            value={filter.type}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, type: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-secondary focus:ring-2 transition-all duration-300 bg-white/50 backdrop-blur-sm text-cmuda"
          >
            <option value="all">Semua Jenis</option>
            <option value="cat">Kucing</option>
            <option value="dog">Anjing</option>
          </select>
          <select
            value={filter.status}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, status: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-secondary focus:ring-2 transition-all duration-300 bg-white/50 backdrop-blur-sm text-cmuda"
          >
            <option value="all">Semua Status</option>
            <option value="available">Tersedia</option>
            <option value="adopted">Diadopsi</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto border-2 border-gray-200 rounded-xl">
        <table className="min-w-full divide-y-2 divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-8 py-4 text-left text-sm font-semibold text-cmuda uppercase tracking-wider">
                Foto
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-cmuda uppercase tracking-wider">
                Nama
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-cmuda uppercase tracking-wider">
                Jenis
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-cmuda uppercase tracking-wider">
                Ras
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-cmuda uppercase tracking-wider">
                Umur
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-cmuda uppercase tracking-wider">
                Status
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-cmuda uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {filteredPets.map((pet) => (
              <tr key={pet.id} className="hover:bg-gray-50">
                <td className="px-8 py-5 whitespace-nowrap">
                  <img
                    src={pet.image || '/placeholder.svg'}
                    alt={pet.name}
                    className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                  />
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-base font-medium text-cmuda">
                    {pet.name}
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-base text-gray-500">
                    {getPetTypeLabel(pet.type)}
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-base text-gray-500">{pet.breed}</div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-base text-gray-500">{pet.age} tahun</div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      pet.adopted === 1
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {pet.adopted === 1 ? 'Diadopsi' : 'Tersedia'}
                  </span>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex gap-4">
                    <button
                      onClick={() => onStatusChange(pet.id, pet.adopted)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      {pet.adopted === 1 ? 'Tersedia Lagi' : 'Ubah ke Diadopsi'}
                    </button>
                    <button
                      onClick={() => onDelete(pet.id)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
