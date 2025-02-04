import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email diperlukan.' }, { status: 400 });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Simpan OTP ke database
    await pool.query(
      'INSERT INTO otp_verifications (email, otp, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))',
      [email, otp]
    );

    // Kirim Email OTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verifikasi OTP Anda',
      text: `Kode OTP Anda adalah ${otp}. Berlaku selama 10 menit.`,
    });

    return NextResponse.json(
      { message: 'OTP berhasil dikirim!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Gagal mengirim OTP.' }, { status: 500 });
  }
}
