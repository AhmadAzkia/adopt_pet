"use client";

import { useCatList } from "@/hooks/useCatList";
import { CatCard } from "@/components/pet-list/cats/cat-card";
import { CatFilters } from "@/components/pet-list/cats/cat-filters";
import { MapView } from "@/components/pet-list/map-view";
import { LoadingSkeleton } from "@/components/pet-list/loading-skeleton";

// Fungsi untuk mengategorikan usia kucing
const ageCategory = (age) => {
  if (age <= 1) return "Anak"; // Usia 0-1 tahun
  if (age >= 2 && age <= 5) return "Muda"; // Usia 2-5 tahun
  if (age > 5) return "Dewasa"; // Usia lebih dari 5 tahun
  return "Semua"; // Jika tidak ada usia yang terdefinisi
};

export default function CatList() {
  const { cats, search, setSearch, filters, setFilters, loading, error } =
    useCatList();

  // Only show cats with valid coordinates
  const catsWithLocation = cats.filter((cat) => cat.latitude && cat.longitude);

  // Filter cats based on selected filters
  const filteredCats = cats.filter((cat) => {
    const ageFilter =
      filters.age === "Semua" ? true : ageCategory(cat.age) === filters.age;
    return (
      (filters.breed === "Semua" || cat.breed === filters.breed) &&
      ageFilter &&
      (filters.gender === "Semua" || cat.gender === filters.gender)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="container mx-auto py-24 px-4 md:px-8">
        <h1 className="text-4xl font-bold text-center text-[#1e40af] mb-4">
          Daftar Kucing Untuk Diadopsi
        </h1>
        <p className="text-base text-gray-600 text-center mb-12">
          Temukan teman berbulu yang cocok untuk Anda di sini.
        </p>

        {/* Map View */}
        <div className="mb-8">
          <MapView pets={catsWithLocation} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <CatFilters filters={filters} setFilters={setFilters} />

          <div className="lg:col-span-3 space-y-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Cari kucing berdasarkan nama atau ras..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
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
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : error ? (
              <p className="text-center text-red-500 py-8">{error}</p>
            ) : filteredCats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCats.map((cat) => (
                  <CatCard key={cat.id} cat={cat} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Tidak ada kucing yang sesuai dengan filter yang dipilih.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
