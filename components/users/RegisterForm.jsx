"use client";
import React, { useState } from "react";
import DataImage from "@/assets/data";
import Image from "next/image";
import Link from "next/link";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "pengadopsi",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-32 px-4 bg-gradient-to-br from-gray-200 via-gray-100 to-white">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-amber-100 opacity-5" />

      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-blue-100">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center">
              <Image src={DataImage.kujing3 || "/placeholder.svg"} alt="Logo" priority={true} width={140} className="mb-6 transform hover:scale-105 transition-transform duration-300" />
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r text-transparent from-blue-600 to-blue-700 bg-clip-text">Adopt Pet</h1>
            </div>
            <p className="text-gray-600 text-center">Silahkan Daftar untuk masuk ke aplikasi.</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                autoComplete="username"
                placeholder="Masukkan Username..."
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="Masukkan Email..."
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                placeholder="Masukkan Password..."
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="block font-medium text-gray-700">
                Sebagai?
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
              >
                <option value="pemilik">Pemilik Hewan (Open Adopsi)</option>
                <option value="pengadopsi">Pengadopsi Hewan</option>
              </select>
            </div>

            <button type="submit" className="w-full py-3 px-6 bg-gradient-to-r from-[#234edc] to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-blue-900/20">
              Daftar
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-blue-900 hover:text-blue-800 transition-colors duration-300">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
