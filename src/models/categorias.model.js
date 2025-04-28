// src/models/categorias.model.js
const CATEGORIAS_QUERIES = {
  OBTENER_TODAS: 'SELECT * FROM categorias',
  OBTENER_POR_ID: 'SELECT * FROM categorias WHERE id = $1',
  CREAR: 'INSERT INTO categorias (nombre) VALUES ($1) RETURNING *',
  ACTUALIZAR: 'UPDATE categorias SET nombre = $1 WHERE id = $2 RETURNING *',
  ELIMINAR: 'DELETE FROM categorias WHERE id = $1 RETURNING *',
};

export default CATEGORIAS_QUERIES;
