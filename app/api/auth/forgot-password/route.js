import { NextResponse } from "next/server";
import pool from "@/lib/db";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Cek apakah email terdaftar di database
    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (user.length === 0) {
      return NextResponse.json(
        { error: "Email tidak ditemukan!" },
        { status: 404 }
      );
    }

    // Generate OTP (6 digit angka)
    const otp = crypto.randomInt(100000, 999999).toString();

    // Simpan OTP di database dengan batas waktu 10 menit
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit dari sekarang
    await pool.query(
      "INSERT INTO otp_verifications (email, otp, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = ?, expires_at = ?",
      [email, otp, expiresAt, otp, expiresAt]
    );

    // Konfigurasi Nodemailer untuk mengirim email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Kode OTP Reset Password Anda",
      text: `Kode OTP Anda adalah: ${otp}`,
      html: `<p>Kode OTP Anda untuk mereset password: <b>${otp}</b></p><p>Jangan berikan kode ini ke siapa pun. Berlaku selama 10 menit.</p>`,
    });

    return NextResponse.json(
      { message: "OTP telah dikirim ke email Anda." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Gagal mengirim OTP." }, { status: 500 });
  }
}
