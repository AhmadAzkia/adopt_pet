import { useState } from "react";

export function PetTable({ pets, onDelete, onStatusChange }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(search.toLowerCase()) ||
      pet.breed.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "adopted" && pet.adopted === 1) ||
      (filter === "available" && pet.adopted === 0);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Cari nama atau ras..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
        >
          <option value="all">Semua Status</option>
          <option value="available">Tersedia</option>
          <option value="adopted">Diadopsi</option>
        </select>
      </div>

      <div className="overflow-x-auto border-2 border-gray-200 rounded-xl">
        <table className="min-w-full divide-y-2 divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Foto
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Ras
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Umur
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPets.map((pet) => (
              <tr key={pet.id} className="hover:bg-gray-50">
                <td className="px-8 py-5 whitespace-nowrap">
                  <img
                    src={pet.image || "/placeholder.svg"}
                    alt={pet.name}
                    className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                  />
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-base font-medium text-gray-900">
                    {pet.name}
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
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {pet.adopted === 1 ? "Diadopsi" : "Tersedia"}
                  </span>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex gap-4">
                    <button
                      onClick={() => onStatusChange(pet.id, pet.adopted)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      {pet.adopted === 1 ? "Tersedia Lagi" : "Ubah ke Diadopsi"}
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
