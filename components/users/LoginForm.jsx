"use client";

import React, { useState } from "react";
import DataImage from "@/assets/data";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Pesan error untuk ditampilkan jika login gagal
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token); // Simpan token di localStorage

        // Trigger event untuk update Navbar
        window.dispatchEvent(new Event("storage"));

        // Decode token JWT
        const payload = JSON.parse(atob(token.split(".")[1]));

        // SweetAlert2 notification
        Swal.fire({
          title: "Login Berhasil!",
          text: `Selamat datang, ${payload.username}`,
          icon: "success",
          confirmButtonText: "Lanjutkan",
        }).then(() => {
          if (payload.role === "pemilik") {
            router.push("/dashboard-pemilik");
          } else if (payload.role === "pengadopsi") {
            router.push("/");
          }
        });
      } else {
        const errorData = await response.json();
        Swal.fire(
          "Login Gagal",
          errorData.message || "Terjadi kesalahan.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "Terjadi kesalahan pada server. Silakan coba lagi.",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-32 px-4 bg-[#ECF7FB]">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-300">
          <div className="flex flex-col items-center mb-8">
            <Image
              src={DataImage.kujing3 || "/placeholder.svg"}
              alt="Logo"
              priority={true}
              width={140}
              className="mb-6 transform hover:scale-105 transition-transform duration-300"
            />
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r text-transparent from-blue-600 to-blue-700 bg-clip-text">
              Adopt Pet
            </h1>
            <p className="text-gray-600 text-center">
              Silahkan Login untuk Login ke aplikasi.
            </p>
          </div>

          {errorMessage && (
            <p className="text-red-600 text-center mb-4">{errorMessage}</p>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="identifier"
                className="block font-medium text-gray-700"
              >
                Email atau Username
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                autoComplete="username"
                placeholder="Loginkan Email atau Username..."
                value={formData.identifier}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-700 focus:ring focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="Loginkan Password..."
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-700 focus:ring focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-[#234edc] to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-blue-900/20"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-900 hover:text-blue-800 transition-colors duration-300"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
