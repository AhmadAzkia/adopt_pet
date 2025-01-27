import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { identifier, password } = await req.json();

  if (!identifier || !password) {
    return new Response(
      JSON.stringify({ message: "Semua field harus diisi!" }),
      {
        status: 400,
      }
    );
  }

  try {
    const [user] = await pool.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [identifier, identifier]
    );

    if (!user || user.length === 0) {
      return new Response(
        JSON.stringify({ message: "Email atau username tidak ditemukan!" }),
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user[0].password);
    if (!isValidPassword) {
      return new Response(JSON.stringify({ message: "Password salah!" }), {
        status: 401,
      });
    }

    const token = jwt.sign(
      { username: user[0].username, role: user[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return new Response(JSON.stringify({ message: "Login berhasil!", token }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Terjadi kesalahan pada server." }),
      { status: 500 }
    );
  }
}
