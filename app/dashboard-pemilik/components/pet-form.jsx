"use client";

import { useState } from "react";

export function PetForm({ onSubmit, loading }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationChange = async (e) => {
    const location = e.target.value;
    if (location) {
      try {
        const address = encodeURIComponent(location);
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setLatitude(lat.toString());
          setLongitude(lng.toString());
        }
      } catch (error) {
        console.error("Error getting coordinates:", error);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold mb-6">Open Adopsi</h3>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-base font-semibold mb-2"
            >
              Nama Hewan
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-base font-semibold mb-2"
            >
              Jenis Hewan
            </label>
            <select
              id="type"
              name="type"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
            >
              <option value="">Pilih jenis hewan</option>
              <option value="cat">Kucing</option>
              <option value="dog">Anjing</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="breed"
              className="block text-base font-semibold mb-2"
            >
              Ras
            </label>
            <input
              type="text"
              id="breed"
              name="breed"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-base font-semibold mb-2">
              Umur (tahun)
            </label>
            <input
              type="number"
              id="age"
              name="age"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-base font-semibold mb-2"
            >
              Jenis Kelamin
            </label>
            <select
              id="gender"
              name="gender"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="male">Jantan</option>
              <option value="female">Betina</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-base font-semibold mb-2"
            >
              Foto Hewan
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
            />
            {imagePreview && (
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                className="mt-2 w-full h-32 object-cover rounded-lg"
              />
            )}
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-base font-semibold mb-2"
            >
              Lokasi
            </label>
            <input
              type="text"
              id="location"
              name="location"
              onChange={handleLocationChange}
              placeholder="Masukkan alamat lengkap"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
            />
          </div>

          <div>
            <label
              htmlFor="latitude"
              className="block text-base font-semibold mb-2"
            >
              Latitude
            </label>
            <input
              type="text"
              id="latitude"
              name="latitude"
              value={latitude}
              readOnly
              className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="longitude"
              className="block text-base font-semibold mb-2"
            >
              Longitude
            </label>
            <input
              type="text"
              id="longitude"
              name="longitude"
              value={longitude}
              readOnly
              className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-base font-semibold mb-2"
          >
            Deskripsi
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#1e40af] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#1e3a8a] transition-colors disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Buka Adopsi"}
        </button>
      </form>
    </div>
  );
}
