"use client";
import React, { useState } from "react";
import DataImage from "@/assets/data";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react"; // Import ikon mata

export default function LoginForm() {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Pesan error untuk ditampilkan jika login gagal
  const [showPassword, setShowPassword] = useState(false); // State untuk menyimpan status tampilan password
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
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
        localStorage.setItem("owner_id", payload.id); // Simpan owner_id di LocalStorage

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

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Lupa Password?",
      input: "email",
      inputPlaceholder: "Masukkan email Anda...",
      showCancelButton: true,
      confirmButtonText: "Kirim OTP",
      cancelButtonText: "Batal",
      inputValidator: (value) => {
        if (!value) {
          return "Email tidak boleh kosong!";
        }
      },
    });

    if (email) {
      try {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          Swal.fire(
            "Cek Email Anda",
            "OTP telah dikirim ke email Anda.",
            "success"
          );

          // Setelah OTP dikirim, buka popup input OTP
          const { value: otp } = await Swal.fire({
            title: "Masukkan OTP",
            input: "text",
            inputPlaceholder: "Masukkan OTP yang dikirim ke email...",
            showCancelButton: true,
            confirmButtonText: "Verifikasi OTP",
            cancelButtonText: "Batal",
            inputValidator: (value) => {
              if (!value) {
                return "OTP tidak boleh kosong!";
              }
            },
          });

          if (otp) {
            const otpResponse = await fetch("/api/otp/verify-otp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, otp }),
            });

            const otpData = await otpResponse.json();

            if (otpResponse.ok) {
              Swal.fire(
                "OTP Valid",
                "Silakan masukkan password baru Anda.",
                "success"
              );

              // Setelah OTP valid, buka popup untuk masukkan password baru
              const { value: newPassword } = await Swal.fire({
                title: "Reset Password",
                input: "password",
                inputPlaceholder: "Masukkan password baru...",
                showCancelButton: true,
                confirmButtonText: "Simpan Password",
                cancelButtonText: "Batal",
                inputValidator: (value) => {
                  if (!value) {
                    return "Password tidak boleh kosong!";
                  }
                },
              });

              if (newPassword) {
                const resetResponse = await fetch("/api/auth/reset-password", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, password: newPassword }),
                });

                const resetData = await resetResponse.json();

                if (resetResponse.ok) {
                  Swal.fire(
                    "Sukses",
                    "Password Anda telah diperbarui!",
                    "success"
                  ).then(() => {
                    router.push("/login"); // Arahkan ke halaman login setelah reset password
                  });
                } else {
                  Swal.fire(
                    "Gagal",
                    resetData.error || "Terjadi kesalahan.",
                    "error"
                  );
                }
              }
            } else {
              Swal.fire("Gagal", otpData.error || "OTP tidak valid.", "error");
            }
          }
        } else {
          Swal.fire("Gagal", data.error || "Terjadi kesalahan.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Terjadi kesalahan pada server.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-32 px-4 bg-background">
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
            <h1 className="text-3xl font-bold mb-2 text-primary">Adopt Pet</h1>
            <p className="text-cmuda text-center text-sm md:text-base">
              Silahkan Login untuk Login ke aplikasi.
            </p>
          </div>

          {errorMessage && (
            <p className="text-red-600 text-center mb-4">{errorMessage}</p>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label
                htmlFor="identifier"
                className="block font-medium text-gray-700"
              ></label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                autoComplete="username"
                placeholder="Masukkan Email atau Username..."
                value={formData.identifier}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-secondary focus:ring-2 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block font-medium text-gray-700"
              ></label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Mengubah type input password
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Masukkan Password..."
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-primary text-white rounded-xl hover:bg-[#1F3D73] transition-all duration-300 shadow-lg shadow-blue-900/20"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            <button
              onClick={handleForgotPassword}
              className="text-secondary hover:text-[#4C8B5A] transition-colors duration-300"
            >
              Lupa Password?
            </button>
          </p>

          <p className="mt-6 text-center text-cmuda">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-secondary hover:text-[#4C8B5A] transition-colors duration-300"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
