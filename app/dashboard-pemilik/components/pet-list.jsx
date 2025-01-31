import { useState } from "react";

export function PetList({ pets, onDelete, onStatusChange }) {
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
      <h3 className="text-2xl font-bold mb-6">Daftar Pet Anda</h3>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari nama atau ras..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-3 border-2 border-gray-300 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
        >
          <option value="all">Semua Status</option>
          <option value="available">Tersedia</option>
          <option value="adopted">Diadopsi</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPets.map((pet) => (
          <div
            key={pet.id}
            className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#1e40af]/20 transition-colors"
          >
            <div className="w-full h-48 bg-[#1e40af]/10 rounded-lg mb-4">
              {pet.image ? (
                <img
                  src={pet.image || "/placeholder.svg"}
                  alt={pet.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#1e40af]">
                  No Image
                </div>
              )}
            </div>
            <h4 className="text-lg font-bold mb-2">{pet.name}</h4>
            <p className="text-gray-700 font-medium">
              {pet.breed} • {pet.age} tahun
            </p>
            <p className="text-gray-700 font-medium">
              {pet.gender === "male" ? "Jantan" : "Betina"}
            </p>
            <p className="text-gray-700 font-medium">{pet.location}</p>

            {pet.description && (
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold">Deskripsi: </span>
                {pet.description}
              </p>
            )}

            <div className="mt-4 flex justify-between items-center">
              <span
                className={`font-semibold ${
                  pet.adopted === 1 ? "text-red-600" : "text-green-600"
                }`}
              >
                {pet.adopted === 1 ? "Diadopsi" : "Tersedia"}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => onStatusChange(pet.id, pet.adopted)}
                  className="text-blue-500 font-semibold hover:underline"
                >
                  {pet.adopted === 1 ? "Tersedia Lagi" : "Ubah ke Diadopsi"}
                </button>
                <button
                  onClick={() => onDelete(pet.id)}
                  className="text-red-500 font-semibold hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
