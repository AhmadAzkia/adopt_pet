"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import DataImage from "@/assets/data";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(""); // Tambahkan state untuk role pengguna
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const updateUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
        setUsername(payload.username);
        setRole(payload.role);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    } else {
      setIsLoggedIn(false);
      setUsername(null);
      setRole(null);
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  };

  useEffect(() => {
    updateUserFromToken();

    // Monitor perubahan localStorage
    window.addEventListener("storage", updateUserFromToken);
    return () => window.removeEventListener("storage", updateUserFromToken);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");

        // Tampilkan alert logout berhasil
        Swal.fire({
          title: "Logout Berhasil",
          text: "Anda telah berhasil logout.",
          icon: "success",
          confirmButtonText: "OK",
        }).then((okResult) => {
          if (okResult.isConfirmed) {
            window.location.href = "/";
          }
        });
      }
    });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-100"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={DataImage.kujing3}
              alt="Adopt Pet Logo"
              width={40}
              height={40}
              priority={true}
              className="transition-transform duration-300 hover:scale-110"
            />
          </Link>

          {/* Desktop Menu */}
          {role !== "pemilik" && (
            <div className="hidden md:flex items-center space-x-8">
              {[
                {
                  name: "Beranda",
                  id: "/",
                },
                {
                  name: "Layanan",
                  id: "#layanan",
                },
                {
                  name: "Daftar Pet",
                  id: "#daftar-pet",
                },
                {
                  name: "Kontak Kami",
                  id: "#kontak-kami",
                },
                ...(role === "Pemilik Hewan"
                  ? [
                      {
                        name: "Open Adopsi",
                        id: "/open-adopsi",
                      },
                    ]
                  : []),
              ].map((item) => (
                <Link
                  href={item.id}
                  key={item.id}
                  className="text-cmuda hover:text-secondary transition-colors duration-300 font-medium relative group"
                >
                  {item.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              ))}
            </div>
          )}
          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            {username ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-start px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-xl shadow-lg shadow-blue-900/20">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{username} &nbsp;</span>
                  </div>
                  {role && (
                    <span className=" text-sm italic text-blue-200">
                      {role}
                    </span>
                  )}
                </div>
                {isLoggedIn && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 border-2 border-blue-900 text-blue-900 rounded-xl hover:bg-blue-900 hover:text-white transition-all duration-300 shadow-lg shadow-blue-900/20"
                  >
                    <span className="hidden sm:inline">Keluar</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-[#1F3D73] transition-all duration-300 shadow-lg shadow-blue-900/20"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-secondary text-white rounded-xl hover:bg-[#4C8B5A] hover:text-white transition-all duration-300 shadow-lg shadow-blue-900/20"
                >
                  Daftar
                </Link>
              </div>
            )}       
          </div>
        </div>
      </div>
    </nav>
  );
}
