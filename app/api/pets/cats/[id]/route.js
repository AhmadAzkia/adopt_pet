import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, { params }) {
  try {
    // Tunggu params sebelum digunakan
    const { id } = await params; // Menambahkan 'await' di sini
    const connection = await pool.getConnection();

    try {
      const [cats] = await connection.execute(
        "SELECT * FROM pets WHERE id = ? AND type = 'cat'",
        [id]
      );

      if (cats.length === 0) {
        return NextResponse.json(
          { success: false, message: "Kucing tidak ditemukan" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, cat: cats[0] });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error fetching cat details:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil detail kucing" },
      { status: 500 }
    );
  }
}
