import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const petId = params.petId;
    if (!petId) {
      return NextResponse.json(
        { success: false, message: "Pet ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    try {
      const [pets] = await connection.execute(
        `SELECT p.*, u.username as owner_name, u.email as owner_email, p.owner_phone
         FROM pets p 
         JOIN users u ON p.owner_id = u.id 
         WHERE p.id = ?`,
        [petId]
      );

      if (pets.length === 0) {
        return NextResponse.json(
          { success: false, message: "Pet tidak ditemukan" },
          { status: 404 }
        );
      }

      const pet = pets[0];
      const { owner_id, ...petDetails } = pet;

      return NextResponse.json({ success: true, pet: petDetails });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error fetching pet details:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil detail pet" },
      { status: 500 }
    );
  }
}
