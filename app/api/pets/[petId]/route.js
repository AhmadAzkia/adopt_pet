import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req, { params }) {
  try {
    const { petId } = params;
    const { adopted } = await req.json();
    const owner_id = req.headers.get("owner-id");

    if (!petId || !owner_id) {
      return NextResponse.json(
        { success: false, message: "Pet ID atau Owner ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    try {
      // Cek apakah pet dimiliki oleh owner yang benar
      const [petCheck] = await connection.execute(
        "SELECT adopted FROM pets WHERE id = ? AND owner_id = ?",
        [petId, owner_id]
      );

      if (petCheck.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Pet tidak ditemukan atau Anda tidak memiliki akses",
          },
          { status: 404 }
        );
      }

      const oldStatus = petCheck[0].adopted;

      // Update status di tabel pets
      await connection.execute(
        "UPDATE pets SET adopted = ?, updated_at = NOW() WHERE id = ?",
        [adopted, petId]
      );

      // Simpan riwayat ke adopt_log
      await connection.execute(
        "INSERT INTO adopt_log (pet_id, owner_id, status_before, status_after, created_at) VALUES (?, ?, ?, ?, NOW())",
        [petId, owner_id, oldStatus, adopted]
      );

      return NextResponse.json({
        success: true,
        message: "Status adopsi berhasil diubah",
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error updating pet status:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengubah status adopsi" },
      { status: 500 }
    );
  }
}
