import db from '../db.js';

class MovimientoStockModel {
  static async obtenerTodos() {
    const result = await db.query('SELECT * FROM movimientos_stock ORDER BY fecha DESC');
    return result.rows;
  }

  static async obtenerPorId(id) {
    const result = await db.query('SELECT * FROM movimientos_stock WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async crear({ producto_id, tipo, cantidad, fecha, motivo, usuario_id }) {
    const result = await db.query(
      `INSERT INTO movimientos_stock (producto_id, tipo, cantidad, fecha, motivo, usuario_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [producto_id, tipo, cantidad, fecha, motivo, usuario_id]
    );
    return result.rows[0];
  }

  static async actualizar(id, { producto_id, tipo, cantidad, fecha, motivo, usuario_id }) {
    const result = await db.query(
      `UPDATE movimientos_stock
       SET producto_id = $1, tipo = $2, cantidad = $3, fecha = $4, motivo = $5, usuario_id = $6
       WHERE id = $7
       RETURNING *`,
      [producto_id, tipo, cantidad, fecha, motivo, usuario_id, id]
    );
    return result.rows[0];
  }

  static async eliminar(id) {
    const result = await db.query('DELETE FROM movimientos_stock WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

export default MovimientoStockModel;
