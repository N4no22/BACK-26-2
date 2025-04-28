import db from '../db.js';

export const getAllProductos = async () => {
  const result = await db.query('SELECT * FROM productos');
  return result.rows;
};

export const getProductoById = async (id) => {
  const result = await db.query('SELECT * FROM productos WHERE id = $1', [id]);
  return result.rows[0];
};

export const createProducto = async ({ nombre, descripcion, precio, stock, codigo_barras, proveedor_id = null, categoria_id = null }) => {
    const result = await db.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, proveedor_id, codigo_barras) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [nombre, descripcion, precio, stock, categoria_id, proveedor_id, codigo_barras]  // Asegúrate de que el orden coincida
    );
    return result.rows[0];
  };

  export const updateProducto = async ({ id, nombre, descripcion, precio, stock, codigo_barras, categoria_id }) => {
    // Si categoria_id o codigo_barras no se pasan, no se actualizan
    const result = await db.query(
      'UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, stock = $4, codigo_barras = COALESCE($5, codigo_barras), categoria_id = COALESCE($6, categoria_id) WHERE id = $7 RETURNING *',
      [nombre, descripcion, precio, stock, codigo_barras, categoria_id, id]
    );
    return result.rows[0];
  };
  

export const deleteProducto = async (id) => {
  const result = await db.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
