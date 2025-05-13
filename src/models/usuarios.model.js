// src/models/usuarios.model.js
import db from '../db.js';  // Asegúrate de que la conexión a la base de datos esté correctamente importada

const Usuario = {
  // Obtener todos los usuarios
  getAll: async () => {
    const result = await db.query('SELECT * FROM usuarios');
    return result.rows;
  },

  // Obtener usuario por ID
  getById: async (id) => {
    const result = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Crear un nuevo usuario
  create: async (usuario) => {
    const { email, password } = usuario;
    const result = await db.query(
      'INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING *',
      [email, password]
    );
    return result.rows[0];
  },

  // Actualizar un usuario
  update: async (id, usuario) => {
    const { email, password } = usuario;
    const result = await db.query(
      'UPDATE usuarios SET email = $1, password = $2 WHERE id = $3 RETURNING *',
      [email, password, id]
    );
    return result.rows[0];
  },

  // Eliminar un usuario
  delete: async (id) => {
    const result = await db.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

export default Usuario;  // Exportar como default
