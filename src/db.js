import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Usa la variable de entorno para la conexión
  ssl: process.env.DATABASE_URL.includes("supabase") ? { rejectUnauthorized: false } : false
});

export default pool;
