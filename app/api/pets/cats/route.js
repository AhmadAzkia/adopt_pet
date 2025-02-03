import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const breed = searchParams.get("breed");
  const age = searchParams.get("age");
  const gender = searchParams.get("gender");
  const search = searchParams.get("search");

  try {
    const connection = await pool.getConnection();
    try {
      let query = `
        SELECT p.*, u.phone as user_phone
        FROM pets p 
        LEFT JOIN users u ON p.owner_id = u.id
        WHERE p.type = 'cat' AND p.adopted = 0
      `;
      const queryParams = [];

      if (breed && breed !== "Semua") {
        query += " AND p.breed = ?";
        queryParams.push(breed);
      }
      if (age && age !== "Semua") {
        if (age === "Anak") {
          query += " AND p.age BETWEEN 0 AND 1"; // Usia 0-1 tahun
        } else if (age === "Muda") {
          query += " AND p.age BETWEEN 2 AND 5"; // Usia 2-5 tahun
        } else if (age === "Dewasa") {
          query += " AND p.age > 5"; // Usia lebih dari 5 tahun
        }
      }
      if (gender && gender !== "Semua") {
        query += " AND p.gender = ?";
        queryParams.push(gender);
      }
      if (search) {
        query += " AND (p.name LIKE ? OR p.breed LIKE ?)";
        queryParams.push(`%${search}%`, `%${search}%`);
      }

      query += " ORDER BY p.created_at DESC";

      const [cats] = await connection.execute(query, queryParams);

      // Use user_phone from the LEFT JOIN with users table
      const processedCats = cats.map((cat) => ({
        ...cat,
        owner_phone: cat.user_phone || null, // We now use user_phone from the users table
      }));

      return NextResponse.json({ success: true, cats: processedCats });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error fetching cats:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data kucing" },
      { status: 500 }
    );
  }
}
