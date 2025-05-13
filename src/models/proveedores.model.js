import db from '../db.js';

export const getAllProveedores = async () => {
  const result = await db.query('SELECT * FROM proveedores');
  return result.rows;
};

export const getProveedorById = async (id) => {
  const result = await db.query('SELECT * FROM proveedores WHERE id = $1', [id]);
  return result.rows[0];
};

export const createProveedor = async (nombre, contacto, telefono, ) => {
  const result = await db.query(
    'INSERT INTO proveedores (nombre, contacto, telefono) VALUES ($1, $2, $3) RETURNING *',
    [nombre, contacto, telefono]
  );
  return result.rows[0];
};

export const updateProveedor = async (id, nombre, contacto, telefono, ) => {
  const result = await db.query(
    'UPDATE proveedores SET nombre = $1, contacto = $2, telefono = $3 WHERE id = $4 RETURNING *',
    [nombre, contacto, telefono,id]
  );
  return result.rows[0];
};

export const deleteProveedor = async (id) => {
  const result = await db.query('DELETE FROM proveedores WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
