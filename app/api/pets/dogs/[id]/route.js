import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const connection = await pool.getConnection();

    try {
      const [dogs] = await connection.execute(
        "SELECT * FROM pets WHERE id = ? AND type = 'dog'",
        [id]
      );

      if (dogs.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Anjing tidak ditemukan' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, dog: dogs[0] });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching dog details:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil detail anjing' },
      { status: 500 }
    );
  }
}
