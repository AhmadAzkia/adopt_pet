"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DataImage from "@/assets/data";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "pengadopsi",
  });
  const [step, setStep] = useState(1); // Step 1: Register, Step 2: OTP Verification
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        Swal.fire("OTP Terkirim!", "Silakan cek email Anda.", "success");
        setStep(2); // Pindah ke verifikasi OTP
      } else {
        Swal.fire("Gagal", "Gagal mengirim OTP.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan pada server.", "error");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/otp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      if (response.ok) {
        // OTP Valid, Simpan User ke Database
        const registerResponse = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (registerResponse.ok) {
          Swal.fire("Sukses", "Akun berhasil dibuat!", "success");
          router.push("/login");
        } else {
          Swal.fire("Gagal", "Gagal menyimpan data akun.", "error");
        }
      } else {
        Swal.fire(
          "OTP Salah",
          "OTP yang Anda masukkan salah atau expired.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan pada server.", "error");
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch("/api/otp/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire("OTP Baru Terkirim", "Silakan cek email Anda.", "success");
      } else {
        Swal.fire(
          "Gagal Mengirim OTP",
          data.error || "Terjadi kesalahan.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan pada server.", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-32 px-4 bg-gradient-to-br bg-[#ECF7FB]">
      <div className="absolute inset-0 opacity-5" />
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-blue-100">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center">
              <Image
                src={DataImage.kujing3 || "/placeholder.svg"}
                alt="Logo"
                priority={true}
                width={140}
                height={140}
                className="mb-6 transform hover:scale-105 transition-transform duration-300"
              />
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r text-transparent from-blue-600 to-blue-700 bg-clip-text">
                Adopt Pet
              </h1>
            </div>
            <p className="text-gray-600 text-center">
              Silahkan Register untuk masuk ke aplikasi.
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleRegister} className="space-y-6">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-xl"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-xl"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-xl"
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl"
              >
                <option value="pemilik">Pemilik Hewan (Open Adopsi)</option>
                <option value="pengadopsi">Pengadopsi Hewan</option>
              </select>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-xl"
              >
                Kirim OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <input
                type="text"
                placeholder="Masukkan OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-xl"
              />
              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white rounded-xl"
              >
                Verifikasi OTP
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                className="w-full py-3 bg-gray-500 text-white rounded-xl mt-2"
              >
                Kirim Ulang OTP
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-gray-600">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-900 hover:text-blue-800 transition-colors duration-300"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
