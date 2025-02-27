const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Necesario para Supabase
});

// Ruta de prueba
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "¡Railway y Supabase funcionando! 🚀", time: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error de conexión con la base de datos" });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
