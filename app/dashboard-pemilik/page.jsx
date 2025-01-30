"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function DashboardPemilik() {
  const router = useRouter();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null); // State untuk debounce

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    const loggedInUserId = localStorage.getItem("owner_id");

    if (!loggedInUserId) {
      console.warn("Owner ID tidak ditemukan, tidak mengambil data pets.");
      setPets([]);
      return;
    }

    try {
      const response = await fetch(`/api/pets?owner_id=${loggedInUserId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response bukan JSON");
      }

      const data = await response.json();
      if (data.success) {
        setPets(data.pets);
      } else {
        console.error("Gagal mendapatkan data pets:", data.message);
        setPets([]); // Pastikan pet kosong jika gagal
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
      setPets([]); // Pastikan pet kosong jika terjadi error
    }
  };

  useEffect(() => {
    const loggedInUserId = localStorage.getItem("owner_id");

    if (!loggedInUserId) {
      Swal.fire(
        "Error!",
        "Anda belum login. Silakan login terlebih dahulu.",
        "error"
      );
      router.push("/login");
      return;
    }

    fetchPets();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const getCoordinates = async (address) => {
    if (!address || address.length < 3) {
      setLatitude("");
      setLongitude("");
      return;
    }

    // Hapus timeout sebelumnya jika masih berjalan
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(async () => {
        try {
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

          if (!apiKey) {
            console.error("Google Maps API Key tidak ditemukan.");
            return;
          }

          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              address
            )}&key=${apiKey}`
          );

          const data = await response.json();

          if (data.status === "OK" && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            setLatitude(lat);
            setLongitude(lng);
          } else {
            console.warn("Geocoding failed:", data.status);
            setLatitude("");
            setLongitude("");
            Swal.fire(
              "Gagal!",
              "Lokasi tidak ditemukan. Coba alamat lain.",
              "error"
            );
          }
        } catch (error) {
          console.error("Error getting coordinates:", error);
          Swal.fire(
            "Error!",
            "Terjadi kesalahan saat mencari lokasi.",
            "error"
          );
        }
      }, 500) // Debounce 500ms
    );
  };

  const handleLocationChange = (e) => {
    const address = e.target.value;
    getCoordinates(address);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData(e.target);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);

      const loggedInUserId = localStorage.getItem("owner_id");

      if (!loggedInUserId) {
        setMessage("Gagal mengirim data: User belum login.");
        setLoading(false);
        return;
      }

      formData.append("owner_id", loggedInUserId);

      const response = await fetch("/api/pets", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire("Berhasil!", "Pet berhasil ditambahkan!", "success");
        e.target.reset();
        setImagePreview(null);
        setLatitude("");
        setLongitude("");
        fetchPets();
      } else {
        Swal.fire("Error!", data.message || "Gagal menambahkan pet.", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Terjadi kesalahan. Silakan coba lagi.", "error");
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async (petId) => {
    Swal.fire({
      title: "Yakin ingin menghapus pet ini?",
      text: "Data akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch("/api/pets", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ petId }),
          });

          const data = await response.json();

          if (data.success) {
            Swal.fire("Dihapus!", "Pet telah dihapus.", "success");
            fetchPets();
          } else {
            Swal.fire(
              "Error!",
              data.message || "Gagal menghapus pet.",
              "error"
            );
          }
        } catch (error) {
          Swal.fire("Error!", "Terjadi kesalahan saat menghapus pet.", "error");
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-20 px-8 pb-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-[#1e40af] mb-8">
          Dashboard Pemilik
        </h2>

        {/* Form Open Adopsi */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6">Open Adopsi</h3>

          {message && (
            <div
              className={`p-4 mb-6 rounded-lg ${
                message.includes("berhasil")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
                  maxLength={255}
                  required
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
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
                  required
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
                  maxLength={100}
                />
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="block text-base font-semibold mb-2"
                >
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
                  <div className="mt-2">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
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
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
                  maxLength={255}
                  placeholder="Masukkan alamat lengkap"
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
                  className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-100"
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
                  className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="description"
                className="block text-base font-semibold mb-2"
              >
                Deskripsi
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
              ></textarea>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="bg-[#1e40af] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#1e3a8a] transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Buka Adopsi"}
              </button>
            </div>
          </form>
        </div>

        {/* Daftar Pet */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6">Daftar Pet Anda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
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

                {/* Status */}
                <div className="mt-4 flex justify-between items-center">
                  <span
                    className={`font-semibold ${
                      pet.adopted === 1 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {pet.adopted === 1 ? "Diadopsi" : "Tersedia"}
                  </span>

                  {/* Tombol Edit & Delete */}
                  <div className="flex gap-2">
                    <button
                      className="text-blue-500 font-semibold hover:underline"
                      onClick={() => toggleAdoptionStatus(pet.id, pet.adopted)}
                    >
                      {pet.adopted === 1 ? "Tersedia Lagi" : "Ubah ke Diadopsi"}
                    </button>
                    <button
                      className="text-red-500 font-semibold hover:underline"
                      onClick={() => deletePet(pet.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
