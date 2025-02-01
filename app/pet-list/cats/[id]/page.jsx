"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapView } from "@/components/pet-list/map-view";

export default function CatDetail({ params }) {
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCat = async () => {
      try {
        const response = await fetch(`/api/pets/cats/${params.id}`);
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
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="aspect-video bg-gray-200 rounded-xl mb-8" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!cat) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-500">Kucing tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const center =
    cat.latitude && cat.longitude
      ? {
          lat: Number.parseFloat(cat.latitude),
          lng: Number.parseFloat(cat.longitude),
        }
      : undefined;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative aspect-video">
            <Image
              src={cat.image || "/placeholder.svg"}
              alt={cat.name}
              fill
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
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Lokasi</h2>
                <p className="text-gray-600 mb-4">{cat.location}</p>
                <MapView pets={[cat]} center={center} />
              </div>
            </div>

            {cat.description && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Deskripsi</h2>
                <p className="text-gray-600">{cat.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
