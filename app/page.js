"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import Link from "next/link";
import DataImage from "@/assets/data";
import { Heart, MapPin, DoorOpen, PawPrintIcon as Paw } from "lucide-react";

export default function Home() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleOpenAdopsiClick = () => {
    Swal.fire({
      title: "Akses Terbatas",
      text: "Anda harus login terlebih dahulu sebagai pemilik untuk mengakses halaman Open Adopsi.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/login";
      }
    });
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-[#ECF7FB]">
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-gradient-to-r from-blue-800 to-blue-700 text-white rounded-full text-sm font-medium shadow-lg shadow-blue-900/20 flex items-center gap-2">
                  <Paw className="w-4 h-4" />
                  Adopt Pet App
                </span>
                <span className="text-gray-600 italic">
                  Berikan Cinta pada Hewan Peliharaan
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
                Adopt, We Both Need{" "}
                <span className="text-blue-900">The Love</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Adopt Pet App adalah sebuah Aplikasi berbasis Website yang
                menyediakan layanan untuk mempermudah seseorang untuk mencari
                informasi tentang mengadopsi hewan peliharaan.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#daftar-pet"
                  className="px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-xl hover:from-blue-800 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-900/20"
                >
                  Lihat Daftar Pet
                </Link>
                {!role && (
                  <button
                    onClick={handleOpenAdopsiClick}
                    className="px-6 py-3 border-2 border-blue-900 text-blue-900 rounded-xl hover:bg-blue-900 hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-900/20"
                  >
                    Open Adopsi
                  </button>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 " />
              <Image
                src={DataImage.Hero3}
                alt="Hero Image"
                className="w-full max-w-[500px] mx-auto transform hover:scale-105 transition-transform duration-300 relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="layanan"
        className="py-20 bg-gradient-to-br from-[#ECF7FB] to-blue-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
              Layanan Kami
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Berikut adalah beberapa layanan yang disediakan oleh Adopt Pet App
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-12 h-12" />,
                title: "Adopsi Pet",
                description:
                  "Menyediakan layanan untuk menyediakan informasi pet yang dapat diadopsi bagi yang bersedia.",
              },
              {
                icon: <MapPin className="w-12 h-12" />,
                title: "Lacak Pet",
                description:
                  "Menyediakan layanan untuk menampilkan informasi adopsi pet yang tersedia didalam Google Maps.",
                highlighted: true,
              },
              {
                icon: <DoorOpen className="w-12 h-12" />,
                title: "Open Adopsi",
                description:
                  "Selain adopsi pet kami juga menyediakan layanan Buka Adopsi bagi seseorang yang ingin hewan peliharaannya diadopsi.",
              },
            ].map((service) => (
              <div
                key={service.title}
                className={`p-8 rounded-2xl backdrop-blur-sm ${
                  service.highlighted
                    ? "bg-gradient-to-br from-blue-900 to-blue-800 text-white"
                    : "bg-white/80"
                } shadow-xl hover:transform hover:scale-105 transition-all duration-300 border border-blue-100`}
              >
                <div
                  className={`${
                    service.highlighted ? "text-white" : "text-blue-900"
                  } mb-6`}
                >
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p
                  className={
                    service.highlighted ? "text-white/90" : "text-gray-600"
                  }
                >
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="daftar-pet" className="py-20  bg-[#ECF7FB]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
              Daftar Pet
            </h2>
            <p className="text-gray-600">
              Berikut ini merupakan Daftar Pet yang tersedia.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              {
                image: DataImage.Cat,
                name: "Kucing",
                href: "/pet-list/cats",
              },
              {
                image: DataImage.Dog,
                name: "Anjing",
                href: "/pet-list/dogs",
              },
            ].map((pet) => (
              <div
                key={pet.name}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-100"
              >
                <div className="w-48 h-48 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-amber-500/10 rounded-full blur-2xl" />
                  <Image
                    src={pet.image}
                    alt={pet.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "contain" }}
                    className="transform hover:scale-110 transition-transform duration-300 relative z-10"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center text-blue-900">
                  {pet.name}
                </h3>
                <Link
                  href={pet.href}
                  className="block w-full text-center bg-gradient-to-r from-blue-900 to-blue-800 text-white py-3 px-6 rounded-xl hover:from-blue-800 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-900/20"
                >
                  Lihat Detail
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
