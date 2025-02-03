"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PetForm } from "./components/pet-form";
import { PetTable } from "./components/pet-table";
import Swal from "sweetalert2";

export default function DashboardPemilik() {
  const router = useRouter();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("list");

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
  }, [router]);

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
        setPets([]);
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
      setPets([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const loggedInUserId = localStorage.getItem("owner_id");

      if (!loggedInUserId) {
        throw new Error("User belum login");
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
        fetchPets();
        setActiveTab("list");
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

  const toggleAdoptionStatus = async (petId, currentStatus) => {
    try {
      const owner_id = localStorage.getItem("owner_id");
      if (!owner_id) {
        throw new Error("User tidak terautentikasi");
      }

      // Log request details for debugging
      console.log("Sending request:", {
        url: `/api/pets/${petId}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "owner-id": owner_id,
        },
        body: {
          adopted: currentStatus === 1 ? 0 : 1,
        },
      });

      const response = await fetch(`/api/pets/${petId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "owner-id": owner_id,
        },
        body: JSON.stringify({
          adopted: currentStatus === 1 ? 0 : 1,
        }),
      });

      // Log response status for debugging
      console.log("Response status:", response.status);

      // Try to parse response as JSON
      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Error parsing JSON:", e);
        throw new Error("Invalid JSON response from server");
      }

      // Log parsed data for debugging
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengubah status");
      }

      if (data.success) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Status adopsi berhasil diubah!",
        });
        await fetchPets(); // Refresh data
      } else {
        throw new Error(data.message || "Gagal mengubah status adopsi");
      }
    } catch (error) {
      console.error("Error:", error);
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-[#1e40af]">
            Dashboard Pemilik
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-6 py-2.5 rounded-lg font-semibold text-base ${
                activeTab === "list"
                  ? "bg-[#1e40af] text-white"
                  : "bg-white text-[#1e40af] border-2 border-[#1e40af]"
              }`}
            >
              Daftar Pet
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`px-6 py-2.5 rounded-lg font-semibold text-base ${
                activeTab === "add"
                  ? "bg-[#1e40af] text-white"
                  : "bg-white text-[#1e40af] border-2 border-[#1e40af]"
              }`}
            >
              Tambah Pet
            </button>
          </div>
        </div>

        {activeTab === "list" ? (
          <PetTable
            pets={pets}
            onDelete={deletePet}
            onStatusChange={toggleAdoptionStatus}
          />
        ) : (
          <PetForm onSubmit={handleSubmit} loading={loading} />
        )}
      </div>
    </div>
  );
}
