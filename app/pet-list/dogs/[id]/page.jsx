'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function DogDetail() {
  const [dog, setDog] = useState(null);
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

    const fetchDog = async () => {
      try {
        const response = await fetch(`/api/pets/dogs/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch dog details');
        }
        const data = await response.json();
        if (data.success) {
          setDog(data.dog);
        } else {
          throw new Error(data.message || 'Failed to fetch dog details');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 px-8 flex flex-col justify-between">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-cmuda">Memuat detail anjing...</p>
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

  if (!dog) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 px-8 flex flex-col justify-between">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-cmuda">Anjing tidak ditemukan</p>
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
              src={dog.image || '/placeholder.svg'}
              alt={dog.name}
              fill
              className="object-contain mx-auto mt-5"
              priority
            />
          </div>
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{dog.name}</h1>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-lg font-semibold mb-2">Informasi Dasar</h2>
                <div className="space-y-2 text-gray-600">
                  <p>Ras: {dog.breed}</p>
                  <p>Usia: {dog.age}</p>
                  <p>Jenis Kelamin: {dog.gender}</p>
                  <p>Ukuran: {dog.size}</p>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Lokasi</h2>
                <p className="text-gray-600">{dog.location}</p>
              </div>
            </div>

            {dog.description && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Deskripsi</h2>
                <p className="text-gray-600">{dog.description}</p>
              </div>
            )}
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="mt-6 px-6 py-2 bg-secondary text-white rounded-lg hover:bg-h2 transition-colors"
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
