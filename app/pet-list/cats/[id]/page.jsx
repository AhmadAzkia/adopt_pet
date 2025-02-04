"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function CatDetail() {
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();
  const { id } = params;
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (!id) return;

    const fetchCat = async () => {
      try {
        const response = await fetch(`/api/pets/cats/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch cat details");
        }
        const data = await response.json();
        if (data.success) {
          setCat(data.cat);
        } else {
          throw new Error(data.message || "Failed to fetch cat details");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCat();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 px-8 flex flex-col justify-between">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-cmuda">Memuat detail kucing...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 px-8 flex flex-col justify-between">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!cat) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 px-8 flex flex-col justify-between">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-cmuda">Kucing tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 px-8 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto flex flex-col space-y-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative aspect-video">
            <Image
              src={cat.image || "/placeholder.svg"}
              alt={cat.name}
              width={50}
              height={50}
              className="object-cover"
              priority
            />
          </div>
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{cat.name}</h1>
              <Link
                href={`/chat/${cat.owner_id}`}
                className="px-6 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors"
              >
                Hubungi Pemilik
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-lg font-semibold mb-2">Informasi Dasar</h2>
                <div className="space-y-2 text-gray-600">
                  <p>Ras: {cat.breed}</p>
                  <p>Usia: {cat.age}</p>
                  <p>Jenis Kelamin: {cat.gender}</p>
                  <p>Ukuran: {cat.size}</p>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Lokasi</h2>
                <p className="text-gray-600">{cat.location}</p>
              </div>
            </div>

            {cat.description && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Deskripsi</h2>
                <p className="text-gray-600">{cat.description}</p>
              </div>
            )}

            {/* Back Button */}
            <button
              onClick={handleBack}
              className="mt-6 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>

      {/* Add some spacing at the bottom for the footer */}
      <div className="pt-6 pb-6"></div>
    </div>
  );
}
