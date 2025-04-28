import express from 'express';
import pool from './db.js';
import productosRoutes from '../src/routes/productos.routes.js';
import categoriasRoutes from '../src/routes/categorias.routes.js'
import cors from 'cors';


const app = express();
app.use(cors());

app.use(express.json());

app.get('/test-db', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    res.json({ message: 'Conexión exitosa a la base de datos', time: rows[0].now });
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
});
app.use('/api/productos', productosRoutes);
app.use('/api/categorias',categoriasRoutes)



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
