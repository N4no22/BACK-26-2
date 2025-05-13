import db from '../db.js';  // Asumo que tienes un archivo db.js que maneja la conexión a tu base de datos

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

// Funciones que interactúan con la base de datos
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
    return rows[0];  // Devolvemos el primer elemento, ya que debería haber solo uno
  } catch (error) {
    console.error('Error al obtener venta por ID:', error);
    throw error;
  }
};



export const updateVenta = async (id, fecha, cliente_id, metodo_pago, estado, total, saldo_pendiente, usuario_id, arqueo_id) => {
  try {
    const { rows } = await db.query(queriesVentas.actualizar, [fecha, cliente_id, metodo_pago, estado, total, saldo_pendiente, usuario_id, arqueo_id, id]);
    return rows[0];  // Devolvemos la venta actualizada
  } catch (error) {
    console.error('Error al actualizar venta:', error);
    throw error;
  }
};

export const deleteVenta = async (id) => {
  try {
    const { rows } = await db.query(queriesVentas.eliminar, [id]);
    return rows[0];  // Devolvemos la venta eliminada
  } catch (error) {
    console.error('Error al eliminar venta:', error);
    throw error;
  }
};
