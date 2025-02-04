'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapView } from '@/components/pet-list/map-view';

export default function DogDetail({ params }) {
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDog = async () => {
      try {
        const response = await fetch(`/api/pets/dogs/${params.id}`);
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

  if (!dog) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-500">Anjing tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const center =
    dog.latitude && dog.longitude
      ? {
          lat: Number.parseFloat(dog.latitude),
          lng: Number.parseFloat(dog.longitude),
        }
      : undefined;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative aspect-video">
            <Image
              src={dog.image || '/placeholder.svg'}
              alt={dog.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{dog.name}</h1>
              <Link
                href={`/chat/${dog.owner_id}`}
                className="px-6 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors"
              >
                Hubungi Pemilik
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-lg font-semibold mb-2">Informasi Dasar</h2>
                <div className="space-y-2 text-gray-600">
                  <p>Ras: {dog.breed}</p>
                  <p>Usia: {dog.age}</p>
                  <p>Jenis Kelamin: {dog.gender}</p>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Lokasi</h2>
                <p className="text-gray-600 mb-4">{dog.location}</p>
                <MapView pets={[dog]} center={center} />
              </div>
            </div>

            {dog.description && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Deskripsi</h2>
                <p className="text-gray-600">{dog.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
