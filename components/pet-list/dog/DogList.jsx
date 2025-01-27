"use client";
import React, { useState } from "react";

const DogList = () => {
  const [search, setSearch] = useState("");
  const [breed, setBreed] = useState("Any");
  const [age, setAge] = useState("Any");
  const [size, setSize] = useState("Any");
  const [gender, setGender] = useState("Any");
  const [userLocation, setUserLocation] = useState(null);
  const [dogs, setDogs] = useState([
    {
      name: "Buddy",
      location: "Houston",
      breed: "Golden Retriever",
      age: "Muda",
      size: "Besar",
      gender: "Jantan",
      image: "/images/buddy.jpg",
    },
    {
      name: "Bella",
      location: "San Francisco",
      breed: "Poodle",
      age: "Dewasa",
      size: "Sedang",
      gender: "Betina",
      image: "/images/bella.jpg",
    },
    {
      name: "Max",
      location: "Seattle",
      breed: "Beagle",
      age: "Anak",
      size: "Kecil",
      gender: "Jantan",
      image: "/images/max.jpg",
    },
  ]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleFilter = (e, setFilter) => {
    setFilter(e.target.value);
  };

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },
      (error) => {
        alert("Tidak dapat mengakses lokasi Anda. Pastikan izin diberikan.");
      }
    );
  };

  const filteredDogs = dogs.filter(
    (dog) =>
      dog.name.toLowerCase().includes(search.toLowerCase()) &&
      (breed === "Any" || dog.breed === breed) &&
      (age === "Any" || dog.age === age) &&
      (size === "Any" || dog.size === size) &&
      (gender === "Any" || dog.gender === gender)
  );

  return (
    <div className="container mx-auto py-24 px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Daftar Anjing Untuk Diadopsi
      </h1>
      <p className="text-sm text-gray-600 mb-8 text-center">
        Temukan teman berbulu yang cocok untuk Anda di sini.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Bagian Filter */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Filter</h2>
          <label className="block mb-2 font-medium">Ras</label>
          <select
            value={breed}
            onChange={(e) => handleFilter(e, setBreed)}
            className="w-full border rounded px-2 py-1 mb-4"
          >
            <option value="Any">Semua</option>
            <option value="Golden Retriever">Golden Retriever</option>
            <option value="Poodle">Poodle</option>
            <option value="Beagle">Beagle</option>
          </select>
          <label className="block mb-2 font-medium">Usia</label>
          <select
            value={age}
            onChange={(e) => handleFilter(e, setAge)}
            className="w-full border rounded px-2 py-1 mb-4"
          >
            <option value="Any">Semua</option>
            <option value="Anak">Anak</option>
            <option value="Muda">Muda</option>
            <option value="Dewasa">Dewasa</option>
          </select>
          <label className="block mb-2 font-medium">Ukuran</label>
          <select
            value={size}
            onChange={(e) => handleFilter(e, setSize)}
            className="w-full border rounded px-2 py-1 mb-4"
          >
            <option value="Any">Semua</option>
            <option value="Kecil">Kecil</option>
            <option value="Sedang">Sedang</option>
            <option value="Besar">Besar</option>
          </select>
          <label className="block mb-2 font-medium">Jenis Kelamin</label>
          <select
            value={gender}
            onChange={(e) => handleFilter(e, setGender)}
            className="w-full border rounded px-2 py-1 mb-4"
          >
            <option value="Any">Semua</option>
            <option value="Jantan">Jantan</option>
            <option value="Betina">Betina</option>
          </select>
        </div>

        {/* Bagian Peta dan Pencarian */}
        <div className="col-span-3 space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="text"
              placeholder="Cari anjing..."
              value={search}
              onChange={handleSearch}
              className="flex-1 border px-4 py-2 rounded shadow-md"
            />
            <button
              onClick={handleLocation}
              className="px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-700"
            >
              Tampilkan Lokasi Saya
            </button>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={
                userLocation
                  ? `https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}&z=15&output=embed`
                  : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093575!2d144.95373531531662!3d-37.81627974202144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d8c3c8eac12e!2sMelbourne%20CBD%2C%20Melbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1614906147655!5m2!1sen!2sus"
              }
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Google Maps"
            ></iframe>
          </div>

          {/* Bagian Daftar Anjing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDogs.length > 0 ? (
              filteredDogs.map((dog, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 shadow-md bg-white"
                >
                  <img
                    src={dog.image}
                    alt={dog.name}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                  <p className="font-medium text-lg mb-2">{dog.name}</p>
                  <p className="text-sm text-gray-600">
                    Lokasi: {dog.location}
                  </p>
                  <p className="text-sm text-gray-600">Ras: {dog.breed}</p>
                  <p className="text-sm text-gray-600">Usia: {dog.age}</p>
                  <p className="text-sm text-gray-600">Ukuran: {dog.size}</p>
                  <p className="text-sm text-gray-600">
                    Jenis Kelamin: {dog.gender}
                  </p>
                  <div className="mt-4 flex justify-between">
                    <button
                      className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-400 text-sm"
                      onClick={() => alert(`Lihat detail untuk ${dog.name}`)}
                    >
                      Lihat Detail
                    </button>
                    <button
                      className="px-3 py-2 bg-blue-400 rounded hover:bg-blue-600 text-sm"
                      onClick={() => alert(`Hubungi pemilik ${dog.name}`)}
                    >
                      Hubungi Pemilik
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">
                Tidak ada anjing yang ditemukan.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogList;