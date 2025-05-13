import db from '../db.js';

export const obtenerResumenDashboard = async () => {
  const hoy = new Date().toISOString().split('T')[0];

  const totalVentas = await db.query(
    'SELECT COALESCE(SUM(total), 0) AS total_ventas FROM ventas WHERE fecha::date = $1',
    [hoy]
  );

  const totalRecaudado = await db.query(
    `SELECT COALESCE(SUM(total - saldo_pendiente), 0) AS total_recaudado 
     FROM ventas 
     WHERE fecha::date = $1`,
    [hoy]
  );

  const totalDeuda = await db.query(
    'SELECT COALESCE(SUM(saldo_pendiente), 0) AS deuda_total FROM ventas WHERE saldo_pendiente > 0'
  );

  const productosBajoStock = await db.query(
    'SELECT COUNT(*) AS cantidad_bajo_stock FROM productos WHERE stock <= 5'
  );

  return {
    totalVentas: parseFloat(totalVentas.rows[0].total_ventas),
    totalRecaudado: parseFloat(totalRecaudado.rows[0].total_recaudado),
    totalDeuda: parseFloat(totalDeuda.rows[0].deuda_total),
    productosBajoStock: parseInt(productosBajoStock.rows[0].cantidad_bajo_stock)
  };
};
