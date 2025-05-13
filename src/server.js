import express from 'express';
import pool from './db.js';
import productosRoutes from '../src/routes/productos.routes.js';
import categoriasRoutes from '../src/routes/categorias.routes.js'
import provedoresRoutes from '../src/routes/provedores.routes.js'
import fiadoresRoutes from '../src/routes/fiadores.routes.js';
import ventasRoutes from '../src/routes/ventas.routes.js'
import pagosRoutes from './routes/pagos.routes.js';
import detallesVentaRoutes from './routes/detallesVenta.routes.js';
import movimientosStockRoutes from './routes/movimientosStock.routes.js';
import descuentosRoutes from './routes/descuentos.routes.js'
import arqueoCajaRoutes from './routes/arqueo_caja.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js';




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
app.use('/api/provedores',provedoresRoutes)
app.use('/api/fiadores', fiadoresRoutes);
app.use('/api/ventas',ventasRoutes); 
app.use('/api/pagos', pagosRoutes);
app.use('/api/detalles_venta', detallesVentaRoutes);
app.use('/api/movimientos-stock', movimientosStockRoutes);
app.use('/api/descuentos',descuentosRoutes);
app.use('/api/arqueo-caja',arqueoCajaRoutes);
app.use('/api/usuarios',usuariosRoutes);
app.use('/api/dashboard', dashboardRoutes);







const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
