import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND otp = ?",
      [email, otp]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid OTP or email." }), {
        status: 400,
      });
    }

    // Update is_verified status
    await pool.query(
      "UPDATE users SET is_verified = TRUE, otp = NULL WHERE email = ?",
      [email]
    );

    return new Response(
      JSON.stringify({ message: "OTP verified successfully!" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong!" }), {
      status: 500,
    });
  }
}
