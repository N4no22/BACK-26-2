import db from '../db.js';


const tabla = 'ventas';

export const queriesVentas = {
  obtenerTodos: `SELECT * FROM ${tabla} ORDER BY fecha DESC`,
  obtenerPorId: `SELECT * FROM ${tabla} WHERE id = $1`,
  crear: `
    INSERT INTO ${tabla} (fecha, cliente_id, metodo_pago, estado, total, saldo_pendiente, usuario_id, arqueo_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,
  actualizar: `
    UPDATE ${tabla}
    SET fecha = $1,
        cliente_id = $2,
        metodo_pago = $3,
        estado = $4,
        total = $5,
        saldo_pendiente = $6,
        usuario_id = $7,
        arqueo_id = $8
    WHERE id = $9
    RETURNING *
  `,
  eliminar: `DELETE FROM ${tabla} WHERE id = $1 RETURNING *`
};

// CRUD base
export const getAllVentas = async () => {
  try {
    const { rows } = await db.query(queriesVentas.obtenerTodos);
    return rows;
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    throw error;
  }
};

export const getVentaById = async (id) => {
  try {
    const { rows } = await db.query(queriesVentas.obtenerPorId, [id]);
    return rows[0];
  } catch (error) {
    console.error('Error al obtener venta por ID:', error);
    throw error;
  }
};

export const updateVenta = async (id, fecha, cliente_id, metodo_pago, estado, total, saldo_pendiente, usuario_id, arqueo_id) => {
  try {
    const { rows } = await db.query(queriesVentas.actualizar, [
      fecha, cliente_id, metodo_pago, estado, total, saldo_pendiente, usuario_id, arqueo_id, id
    ]);
    return rows[0];
  } catch (error) {
    console.error('Error al actualizar venta:', error);
    throw error;
  }
};

export const deleteVenta = async (id) => {
  try {
    const { rows } = await db.query(queriesVentas.eliminar, [id]);
    return rows[0];
  } catch (error) {
    console.error('Error al eliminar venta:', error);
    throw error;
  }
};

// ✅ NUEVO: crear venta completa (con detalles, stock, movimiento y fiado)
export const crearVentaCompleta = async ({ venta, detalles, pagoFiado }) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // 1. Insertar venta
    const ventaResult = await client.query(queriesVentas.crear, [
      venta.fecha,
      venta.cliente_id,
      venta.metodo_pago,
      venta.estado,
      venta.total,
      venta.saldo_pendiente,
      venta.usuario_id,
      venta.arqueo_id
    ]);
    const nuevaVenta = ventaResult.rows[0];

    // 2. Insertar detalles, actualizar stock y registrar movimientos de stock
    for (const item of detalles) {
      await client.query(`
        INSERT INTO detalles_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        nuevaVenta.id,
        item.producto_id,
        item.cantidad,
        item.precio_unitario,
        item.subtotal
      ]);

      await client.query(`
        UPDATE productos
        SET stock = stock - $1
        WHERE id = $2
      `, [
        item.cantidad,
        item.producto_id
      ]);

      await client.query(`
        INSERT INTO movimientos_stock (producto_id, tipo, cantidad, fecha, venta_id, motivo, usuario_id)
        VALUES ($1, 'salida', $2, $3, $4, $5, $6)
      `, [
        item.producto_id,
        item.cantidad,
        venta.fecha,
        nuevaVenta.id,
        'venta',
        venta.usuario_id
      ]);
    }

    // 3. Insertar pago fiado y actualizar saldo pendiente en clientes_fiadores
    if (venta.metodo_pago === 'fiado' && pagoFiado) {
      await client.query(`
        INSERT INTO pagos_fiados (cliente_id, fecha, monto, metodo_pago, venta_id, estado, usuario_id, arqueo_id)
        VALUES ($1, $2, $3, $4, $5, 'pendiente', $6, $7)
      `, [
        venta.cliente_id,
        venta.fecha,
        pagoFiado.monto,
        pagoFiado.metodo_pago,
        nuevaVenta.id,
        venta.usuario_id,
        venta.arqueo_id
      ]);

      await client.query(`
        UPDATE clientes_fiadores
        SET saldo_pendiente = saldo_pendiente + $1
        WHERE id = $2
      `, [
        pagoFiado.monto,
        venta.cliente_id
      ]);
    }

    await client.query('COMMIT');
    return nuevaVenta;

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en crearVentaCompleta:', error);
    throw error;
  } finally {
    client.release();
  }
};
