// src/models/arqueo_caja.model.js
import db from '../db.js';  // Asegúrate de que la conexión a la base de datos esté correctamente importada

const ArqueoCaja = {
  // Obtener todos los arqueos de caja
  getAll: async () => {
    const result = await db.query('SELECT * FROM arqueo_caja');
    return result.rows;
  },

  // Obtener arqueo de caja por ID
  getById: async (id) => {
    const result = await db.query('SELECT * FROM arqueo_caja WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Crear un nuevo arqueo de caja
  create: async (arqueo) => {
    const { fecha, usuario_id, saldo_anterior, ingresos, egresos, saldo_final, estado } = arqueo;
    const result = await db.query(
      'INSERT INTO arqueo_caja (fecha, usuario_id, saldo_anterior, ingresos, egresos, saldo_final, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [fecha, usuario_id, saldo_anterior, ingresos, egresos, saldo_final, estado]
    );
    return result.rows[0];
  },

  // Actualizar un arqueo de caja
  update: async (id, arqueo) => {
    const { fecha, usuario_id, saldo_anterior, ingresos, egresos, saldo_final, estado } = arqueo;
    const result = await db.query(
      'UPDATE arqueo_caja SET fecha = $1, usuario_id = $2, saldo_anterior = $3, ingresos = $4, egresos = $5, saldo_final = $6, estado = $7 WHERE id = $8 RETURNING *',
      [fecha, usuario_id, saldo_anterior, ingresos, egresos, saldo_final, estado, id]
    );
    return result.rows[0];
  },

  // Eliminar un arqueo de caja
  delete: async (id) => {
    const result = await db.query('DELETE FROM arqueo_caja WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

export default ArqueoCaja;  // Exportar como default
