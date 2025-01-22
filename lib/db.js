import mysql from "mysql2/promise";

// Konfigurasi koneksi database
const pool = mysql.createPool({
  host: process.env.local.DATABASE_HOST, // Alamat host database
  user: process.env.local.DATABASE_USER, // Username database
  password: process.env.local.DATABASE_PASSWORD, // Password database
  database: process.env.local.DATABASE_NAME, // Nama database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
