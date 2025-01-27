import bcrypt from "bcrypt";
import pool from "@/lib/db";

export async function POST(req) {
  const { username, email, password, role } = await req.json();

  // Validasi input
  if (!username || !email || !password || !role) {
    return new Response(
      JSON.stringify({ error: "Semua field harus diisi dengan lengkap." }),
      { status: 400 }
    );
  }

  if (!["pengadopsi", "pemilik"].includes(role)) {
    return new Response(JSON.stringify({ error: "Role tidak valid." }), {
      status: 400,
    });
  }

  try {
    // Cek apakah email sudah terdaftar
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return new Response(JSON.stringify({ error: "Email sudah terdaftar." }), {
        status: 400,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke database
    await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, role]
    );

    return new Response(JSON.stringify({ message: "Registrasi berhasil." }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Gagal melakukan registrasi." }),
      { status: 500 }
    );
  }
}
