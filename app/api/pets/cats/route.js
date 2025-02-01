import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const breed = searchParams.get("breed")
  const age = searchParams.get("age")
  const gender = searchParams.get("gender")
  const search = searchParams.get("search")

  try {
    const connection = await pool.getConnection()
    try {
      let query = "SELECT * FROM pets WHERE type = 'cat' AND adopted = 0"
      const queryParams = []

      if (breed && breed !== "Semua") {
        query += " AND breed = ?"
        queryParams.push(breed)
      }
      if (age && age !== "Semua") {
        query += " AND age = ?"
        queryParams.push(age)
      }
      if (gender && gender !== "Semua") {
        query += " AND gender = ?"
        queryParams.push(gender)
      }
      if (search) {
        query += " AND (name LIKE ? OR breed LIKE ?)"
        queryParams.push(`%${search}%`, `%${search}%`)
      }

      // Order by most recently added
      query += " ORDER BY created_at DESC"

      const [cats] = await connection.execute(query, queryParams)

      return NextResponse.json({ success: true, cats })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Error fetching cats:", error)
    return NextResponse.json({ success: false, message: "Gagal mengambil data kucing" }, { status: 500 })
  }
}

