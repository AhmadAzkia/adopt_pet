import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { email } = await req.json();

    console.log('Permintaan Kirim Ulang OTP untuk:', email);

    if (!email) {
      return NextResponse.json(
        { error: 'Email tidak boleh kosong.' },
        { status: 400 }
      );
    }

    // Cek apakah email ada dalam daftar OTP sebelumnya
    const [existingOtp] = await pool.query(
      'SELECT * FROM otp_verifications WHERE email = ?',
      [email]
    );

    if (existingOtp.length === 0) {
      return NextResponse.json(
        { error: 'Email belum meminta OTP.' },
        { status: 400 }
      );
    }

    // Buat OTP baru
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // OTP berlaku 5 menit

    // Update OTP di database
    await pool.query(
      'UPDATE otp_verifications SET otp = ?, expires_at = ? WHERE email = ?',
      [otp, otpExpiration, email]
    );

    // Kirim OTP baru via email
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
      subject: 'Kode OTP Baru Anda',
      text: `Kode OTP baru Anda adalah: ${otp}`,
      html: `<p>Kode OTP baru Anda adalah: <strong>${otp}</strong></p>`,
    });

    return NextResponse.json(
      { message: 'OTP baru telah dikirim ke email Anda.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengirim ulang OTP.' },
      { status: 500 }
    );
  }
}
