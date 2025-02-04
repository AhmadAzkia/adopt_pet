import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email dan OTP diperlukan.' },
        { status: 400 }
      );
    }

    // Cek OTP
    const [result] = await pool.query(
      'SELECT * FROM otp_verifications WHERE email = ? AND otp = ? AND expires_at > NOW()',
      [email, otp]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'OTP tidak valid atau telah kedaluwarsa.' },
        { status: 400 }
      );
    }

    // Hapus OTP setelah verifikasi sukses
    await pool.query('DELETE FROM otp_verifications WHERE email = ?', [email]);

    return NextResponse.json(
      { message: 'OTP berhasil diverifikasi!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}
