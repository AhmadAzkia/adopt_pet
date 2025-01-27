import mysql from "mysql2/promise";

// Konfigurasi koneksi database
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST, // Alamat host database
  user: process.env.DATABASE_USER, // Username database
  password: process.env.DATABASE_PASSWORD, // Password database
  database: process.env.DATABASE_NAME, // Nama database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
