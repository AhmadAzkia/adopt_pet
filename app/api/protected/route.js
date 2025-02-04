import { verifyToken } from '@/middleware/auth';

export async function GET(req) {
  try {
    const user = verifyToken(req); // Verifikasi token
    return new Response(JSON.stringify({ message: 'Akses diizinkan.', user }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Akses ditolak: ' + error.message }),
      { status: 403 }
    );
  }
}
