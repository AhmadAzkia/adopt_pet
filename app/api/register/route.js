import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { username, email, password, role, owner_phone } = await req.json();

    if (!username || !email || !password || !role || !owner_phone) {
      return NextResponse.json(
        { error: 'Semua field harus diisi!' },
        { status: 400 }
      );
    }

    // Format nomor telepon agar dimulai dengan 62
    let formattedPhone = owner_phone.replace(/\D/g, ''); // Menghapus karakter non-digit

    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.slice(1); // Mengganti "0" dengan "62"
    } else if (!formattedPhone.startsWith('62')) {
      formattedPhone = '62' + formattedPhone; // Menambahkan "62" jika tidak ada
    }

    // Cek apakah nomor telepon sudah terdaftar
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE phone = ?",
      [formattedPhone]
    );

    if (existingUser && existingUser.length > 0) {
      // Jika nomor telepon sudah terdaftar, pastikan role-nya sama
      if (existingUser[0].role !== role) {
        return NextResponse.json(
          { error: "Nomor telepon sudah terdaftar untuk peran berbeda!" },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke database
    await pool.query(
      'INSERT INTO users (username, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, role, formattedPhone]
    );

    return NextResponse.json(
      { message: 'Registrasi berhasil!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan user.' },
      { status: 500 }
    );
  }
}
