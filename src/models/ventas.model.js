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

    // 1. Crear venta (total inicial en 0)
    const ventaResult = await client.query(queriesVentas.crear, [
      venta.fecha,
      venta.cliente_id,
      venta.metodo_pago,
      venta.estado,
      0, // 👈 IMPORTANTE: el total lo calculamos después
      venta.saldo_pendiente,
      venta.usuario_id,
      venta.arqueo_id
    ]);

    const nuevaVenta = ventaResult.rows[0];

    let totalCalculado = 0;

    // 2. Procesar detalles
    for (const item of detalles) {
      // 2.1 Obtener producto real desde BD
      const { rows } = await client.query(
        "SELECT * FROM productos WHERE id = $1",
        [item.producto_id]
      );

      const producto = rows[0];

      if (!producto) {
        throw new Error(`Producto ${item.producto_id} no existe`);
      }

      // 2.2 Validar tipo de venta
      if (
        producto.tipo_venta === "unidad" &&
        !Number.isInteger(item.cantidad)
      ) {
        throw new Error(
          `Cantidad inválida para producto por unidad (${producto.nombre})`
        );
      }

      // 2.3 Validar stock disponible
      if (item.cantidad > producto.stock) {
        throw new Error(`Stock insuficiente de ${producto.nombre}`);
      }

      // 2.4 Calcular precio real (NO confiar en frontend)
      const precio = parseFloat(producto.precio);
      const cantidad = parseFloat(item.cantidad);
      const subtotal = cantidad * precio;

      totalCalculado += subtotal;

      // 2.5 Insertar detalle
      await client.query(`
        INSERT INTO detalles_venta 
        (venta_id, producto_id, cantidad, precio_unitario, subtotal)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        nuevaVenta.id,
        producto.id,
        cantidad,
        precio,
        subtotal
      ]);

      // 2.6 Descontar stock
      await client.query(`
        UPDATE productos
        SET stock = stock - $1
        WHERE id = $2
      `, [
        cantidad,
        producto.id
      ]);

      // 2.7 Registrar movimiento de stock
      await client.query(`
        INSERT INTO movimientos_stock 
        (producto_id, tipo, cantidad, fecha, venta_id, motivo, usuario_id)
        VALUES ($1, 'salida', $2, $3, $4, $5, $6)
      `, [
        producto.id,
        cantidad,
        venta.fecha,
        nuevaVenta.id,
        'venta',
        venta.usuario_id
      ]);
    }

    // 3. Actualizar total REAL de la venta
    await client.query(`
      UPDATE ventas
      SET total = $1
      WHERE id = $2
    `, [totalCalculado, nuevaVenta.id]);

    // 4. Manejo de FIADO
    if (venta.metodo_pago === 'fiado' && pagoFiado) {
      await client.query(`
        INSERT INTO pagos_fiados 
        (cliente_id, fecha, monto, metodo_pago, venta_id, estado, usuario_id, arqueo_id)
        VALUES ($1, $2, $3, $4, $5, 'pendiente', $6, $7)
      `, [
        venta.cliente_id,
        venta.fecha,
        totalCalculado, // 👈 usamos el total real
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
        totalCalculado,
        venta.cliente_id
      ]);
    }

    await client.query('COMMIT');

    return {
      ...nuevaVenta,
      total: totalCalculado
    };

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en crearVentaCompleta:', error);
    throw error;
  } finally {
    client.release();
  }
};
