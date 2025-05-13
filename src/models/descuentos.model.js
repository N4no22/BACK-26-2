// src/models/descuentos.model.js
import db from '../db.js';  // Asegúrate de que la conexión a la base de datos esté correctamente importada

const Descuento = {
  getAll: async () => {
    const result = await db.query('SELECT * FROM descuentos');
    return result.rows;
  },

  getById: async (id) => {
    const result = await db.query('SELECT * FROM descuentos WHERE id = $1', [id]);
    return result.rows[0];
  },

  create: async (descuento) => {
    const { nombre, tipo, valor, fecha_inicio, fecha_fin } = descuento;
    const result = await db.query(
      'INSERT INTO descuentos (nombre, tipo, valor, fecha_inicio, fecha_fin) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, tipo, valor, fecha_inicio, fecha_fin]
    );
    return result.rows[0];
  },

  update: async (id, descuento) => {
    const { nombre, tipo, valor, fecha_inicio, fecha_fin } = descuento;
    const result = await db.query(
      'UPDATE descuentos SET nombre = $1, tipo = $2, valor = $3, fecha_inicio = $4, fecha_fin = $5 WHERE id = $6 RETURNING *',
      [nombre, tipo, valor, fecha_inicio, fecha_fin, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await db.query('DELETE FROM descuentos WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

export default Descuento;  // Exportar como default
