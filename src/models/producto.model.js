import db from '../db.js';

// Obtener todos los productos
export const getAllProductos = async () => {
  const result = await db.query('SELECT * FROM productos');
  return result.rows;
};

// Obtener producto por ID
export const getProductoById = async (id) => {
  const result = await db.query('SELECT * FROM productos WHERE id = $1', [id]);
  return result.rows[0];
};

// Crear producto con movimiento de stock (entrada)
export const createProducto = async ({
  nombre,
  descripcion = null,
  precio,
  stock,
  codigo_barras = null,
  proveedor_id = null,
  categoria_id = null,
  usuario_id,
  tipo_venta = 'unidad',
  unidad_medida = 'unidad'
}) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 🔥 VALIDACIONES

    if (!nombre || nombre.trim() === '') {
      throw new Error('El nombre es obligatorio');
    }

    if (precio <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    if (stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    if (!['unidad', 'peso'].includes(tipo_venta)) {
      throw new Error('Tipo de venta inválido');
    }

    if (!['unidad', 'kg', 'g', 'litro'].includes(unidad_medida)) {
      throw new Error('Unidad de medida inválida');
    }

    if (tipo_venta === 'unidad' && !Number.isInteger(stock)) {
      throw new Error('El stock debe ser entero para productos por unidad');
    }

    // Forzar coherencia
    if (tipo_venta === 'unidad') {
      unidad_medida = 'unidad';
    }

    // 1. Insertar producto
    const resultProducto = await client.query(
      `INSERT INTO productos 
      (nombre, descripcion, precio, stock, categoria_id, proveedor_id, codigo_barras, tipo_venta, unidad_medida)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        nombre.trim(),
        descripcion,
        precio,
        stock,
        categoria_id,
        proveedor_id,
        codigo_barras,
        tipo_venta,
        unidad_medida
      ]
    );

    const producto = resultProducto.rows[0];

    // 2. Movimiento inicial de stock
    if (stock > 0) {
      await client.query(
        `INSERT INTO movimientos_stock 
        (producto_id, tipo, cantidad, fecha, motivo, usuario_id)
        VALUES ($1, 'entrada', $2, NOW(), 'Carga inicial', $3)`,
        [producto.id, stock, usuario_id]
      );
    }

    await client.query('COMMIT');

    return producto;

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Actualizar producto y registrar movimiento de stock si cambia el stock
export const updateProducto = async ({ id, nombre, descripcion, precio, stock, codigo_barras, categoria_id, usuario_id }) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const resPrevio = await client.query('SELECT stock FROM productos WHERE id = $1', [id]);
    if (resPrevio.rowCount === 0) throw new Error('Producto no encontrado');
    const stockAnterior = resPrevio.rows[0].stock;

    const resultProducto = await client.query(
      `UPDATE productos
       SET nombre = $1, descripcion = $2, precio = $3, stock = $4,
           codigo_barras = COALESCE($5, codigo_barras),
           categoria_id = COALESCE($6, categoria_id)
       WHERE id = $7
       RETURNING *`,
      [nombre, descripcion, precio, stock, codigo_barras, categoria_id, id]
    );

    const producto = resultProducto.rows[0];
    const diferencia = stock - stockAnterior;

    if (diferencia !== 0) {
      await client.query(
        `INSERT INTO movimientos_stock (producto_id, tipo, cantidad, fecha, motivo, usuario_id)
         VALUES ($1, $2, $3, NOW(), 'Actualización de stock', $4)`,
        [id, diferencia > 0 ? 'entrada' : 'salida', Math.abs(diferencia), usuario_id]
      );
    }

    await client.query('COMMIT');
    return producto;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Eliminar producto y registrar movimiento de salida del stock
export const deleteProducto = async (id, usuario_id) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const resPrevio = await client.query('SELECT stock FROM productos WHERE id = $1', [id]);
    if (resPrevio.rowCount === 0) throw new Error('Producto no encontrado');
    const stockActual = resPrevio.rows[0].stock;

    const resultProducto = await client.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
    const producto = resultProducto.rows[0];

    if (stockActual > 0) {
      await client.query(
        `INSERT INTO movimientos_stock (producto_id, tipo, cantidad, fecha, motivo, usuario_id)
         VALUES ($1, 'salida', $2, NOW(), 'Producto eliminado', $3)`,
        [id, stockActual, usuario_id]
      );
    }

    await client.query('COMMIT');
    return producto;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
