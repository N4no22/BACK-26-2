const crearDetalleVenta = async (db, detalle) => {
    const { venta_id, producto_id, cantidad, subtotal, precio_unitario } = detalle;
    const result = await db.query(
      `INSERT INTO detalles_venta (venta_id, producto_id, cantidad, subtotal, precio_unitario)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [venta_id, producto_id, cantidad, subtotal, precio_unitario]
    );
    return result.rows[0];
  };
  
  const obtenerDetallesPorVenta = async (db, ventaId) => {
    const result = await db.query(
      `SELECT * FROM detalles_venta WHERE venta_id = $1`,
      [ventaId]
    );
    return result.rows;
  };
  
  const eliminarDetallePorId = async (db, id) => {
    const result = await db.query(
      `DELETE FROM detalles_venta WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  };
  
  export default {
    crearDetalleVenta,
    obtenerDetallesPorVenta,
    eliminarDetallePorId
  };
  