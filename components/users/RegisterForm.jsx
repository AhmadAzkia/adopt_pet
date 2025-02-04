'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataImage from '@/assets/data';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react'; // Import ikon mata

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    owner_phone: '',
    role: 'pengadopsi',
  });
  const [step, setStep] = useState(1); // Step 1: Register, Step 2: OTP Verification
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State untuk menyimpan status tampilan password

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Memastikan nomor telepon dimulai dengan "62" jika mulai dengan "0"
    if (name === 'owner_phone') {
      let formattedPhone = value.replace(/\D/g, ''); // Menghapus karakter non-digit

      if (formattedPhone.startsWith('0')) {
        formattedPhone = '62' + formattedPhone.slice(1); // Mengganti "0" dengan "62"
      } else if (!formattedPhone.startsWith('62')) {
        formattedPhone = '62' + formattedPhone; // Menambahkan "62" jika tidak ada
      }

      setFormData({ ...formData, [name]: formattedPhone });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {

      const checkPhoneResponse = await fetch("/api/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.owner_phone,
          role: formData.role,
        }),
      });

      const phoneData = await checkPhoneResponse.json();
      if (!checkPhoneResponse.ok) {
        Swal.fire("Gagal", phoneData.error, "error");
        return;
      }

      const response = await fetch("/api/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        Swal.fire('OTP Terkirim!', 'Silakan cek email Anda.', 'success');
        setStep(2); // Pindah ke verifikasi OTP
      } else {
        Swal.fire('Gagal', 'Gagal mengirim OTP.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi kesalahan pada server.', 'error');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/otp/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      if (response.ok) {
        // OTP Valid, Simpan User ke Database
        const registerResponse = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (registerResponse.ok) {
          Swal.fire('Sukses', 'Akun berhasil dibuat!', 'success');
          router.push('/login');
        } else {
          Swal.fire('Gagal', 'Gagal menyimpan data akun.', 'error');
        }
      } else {
        Swal.fire(
          'OTP Salah',
          'OTP yang Anda masukkan salah atau expired.',
          'error'
        );
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi kesalahan pada server.', 'error');
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch('/api/otp/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire('OTP Baru Terkirim', 'Silakan cek email Anda.', 'success');
      } else {
        Swal.fire(
          'Gagal Mengirim OTP',
          data.error || 'Terjadi kesalahan.',
          'error'
        );
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi kesalahan pada server.', 'error');
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
                src={DataImage.kujing3 || '/placeholder.svg'}
                alt="Logo"
                priority={true}
                width={140}
                height={140}
                className="mb-6 transform hover:scale-105 transition-transform duration-300"
              />
              <h1 className="text-3xl font-bold mb-2 ml-5 text-primary bg-clip-text">
                Adopt Pet
              </h1>
            </div>
            <p className="text-cmuda text-center">
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-secondary focus:ring-2 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-secondary focus:ring-2 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} // Mengubah type input password
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-secondary focus:ring-2 transition-all duration-300 bg-white/50 backdrop-blur-sm"
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
              <input
                type="tel"
                name="owner_phone"
                placeholder="Nomor WhatsApp"
                value={formData.owner_phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-secondary focus:ring-2 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-secondary focus:ring-2 transition-all duration-300 bg-white/50 backdrop-blur-sm text-cmuda"
              >
                <option value="pemilik">Pemilik Hewan (Open Adopsi)</option>
                <option value="pengadopsi">Pengadopsi Hewan</option>
              </select>
              <button
                type="submit"
                className="w-full py-3 bg-primary hover:bg-[#1F3D73] text-white rounded-xl"
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-secondary focus:ring-2 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              />
              <button
                type="submit"
                className="w-full py-3 bg-secondary hover:bg-[#4C8B5A] text-white rounded-xl"
              >
                Verifikasi OTP
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                className="w-full py-3 bg-primary hover:bg-[#1F3D73] text-white rounded-xl mt-2"
              >
                Kirim Ulang OTP
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-cmuda">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="font-semibold text-secondary hover:text-[#4C8B5A] transition-colors duration-300"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
