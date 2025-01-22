import jwt from "jsonwebtoken";

export const verifyToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token tidak tersedia atau salah format.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Tambahkan data user ke request
    return decoded;
  } catch (error) {
    throw new Error("Token tidak valid atau sudah kadaluarsa.");
  }
};

export const checkRole = (req, roleRequired) => {
  const { role } = req.user;

  if (role !== roleRequired) {
    throw new Error("Akses ditolak. Anda tidak memiliki izin.");
  }
};
