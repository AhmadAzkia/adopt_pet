import { NextResponse } from "next/server";
import pool from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

// ✅ HANDLER GET - Ambil daftar pets dari database
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const owner_id = searchParams.get("owner_id");

    if (!owner_id) {
      return NextResponse.json(
        { success: false, message: "Owner ID diperlukan" },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    try {
      const [pets] = await connection.execute(
        "SELECT * FROM pets WHERE owner_id = ?",
        [owner_id]
      );

      return NextResponse.json({ success: true, pets });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error fetching pets:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data pet" },
      { status: 500 }
    );
  }
}

// ✅ HANDLER POST - Tambah pet baru ke database
export async function POST(req) {
  try {
    const formData = await req.formData();

    // Ambil nilai dari form
    const name = formData.get("name");
    const type = formData.get("type");
    const breed = formData.get("breed");
    const age = formData.get("age");
    const gender = formData.get("gender");
    const location = formData.get("location");
    const description = formData.get("description");
    const owner_id = formData.get("owner_id");
    const latitude = formData.get("latitude");
    const longitude = formData.get("longitude");

    if (!owner_id) {
      return NextResponse.json(
        { success: false, message: "Owner ID tidak boleh kosong" },
        { status: 400 }
      );
    }

    // ✅ CEK APAKAH OWNER_ID ADA DI TABEL USERS
    const connection = await pool.getConnection();
    try {
      const [userCheck] = await connection.execute(
        "SELECT id FROM users WHERE id = ?",
        [owner_id]
      );

      if (userCheck.length === 0) {
        return NextResponse.json(
          { success: false, message: "Owner ID tidak ditemukan di database" },
          { status: 400 }
        );
      }
    } finally {
      connection.release();
    }

    // ✅ HANDLE UPLOAD GAMBAR KE CLOUDINARY
    let imageUrl = "";
    const image = formData.get("image");

    if (image) {
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { resource_type: "auto", folder: "pets" },
              (error, result) => {
                if (error) {
                  console.error("Cloudinary Upload Error:", error);
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            )
            .end(buffer);
        });

        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Error saat upload gambar:", uploadError);
        return NextResponse.json(
          { success: false, message: "Gagal mengunggah gambar" },
          { status: 500 }
        );
      }
    }

    // ✅ SIMPAN DATA PET KE DATABASE
    try {
      const connection = await pool.getConnection();
      try {
        const [result] = await connection.execute(
          `INSERT INTO pets (owner_id, name, type, breed, age, gender, image, location, latitude, longitude, description, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            owner_id,
            name,
            type,
            breed,
            age,
            gender,
            imageUrl,
            location,
            latitude,
            longitude,
            description,
          ]
        );

        return NextResponse.json({
          success: true,
          message: "Pet berhasil ditambahkan",
          petId: result.insertId,
        });
      } finally {
        connection.release();
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { success: false, message: "Gagal menyimpan pet ke database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error adding pet:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan di server" },
      { status: 500 }
    );
  }
}

// ✅ HANDLER DELETE - Hapus data pet dari database
export async function DELETE(req) {
  try {
    const { petId } = await req.json();

    if (!petId) {
      return NextResponse.json(
        { success: false, message: "Pet ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    try {
      await connection.execute("DELETE FROM pets WHERE id = ?", [petId]);

      return NextResponse.json({
        success: true,
        message: "Pet berhasil dihapus",
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error deleting pet:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus pet" },
      { status: 500 }
    );
  }
}
