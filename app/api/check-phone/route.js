import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { phone, role } = await req.json();

    // Query untuk mengecek apakah nomor telepon sudah terdaftar dengan role yang berbeda
    const query = `SELECT * FROM users WHERE phone = ?`;
    const [existingUser] = await pool.query(query, [phone]);

    if (existingUser && existingUser.length > 0) {
      // Jika nomor telepon ditemukan di database, cek apakah peran (role) berbeda
      const existingRole = existingUser[0].role;
      if (existingRole !== role) {
        return NextResponse.json(
          {
            error: `Nomor telepon sudah digunakan oleh akun dengan peran ${existingRole}.`,
          },
          { status: 400 }
        );
      }
    }

    // Jika tidak ada pengguna yang ditemukan, lanjutkan
    return NextResponse.json(
      { message: "Nomor telepon valid." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking phone:", error);
    return NextResponse.json(
      { error: "Gagal memeriksa nomor telepon." },
      { status: 500 }
    );
  }
}
