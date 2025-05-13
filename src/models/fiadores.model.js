import db from "../db.js";

export const getAllFiadores = async () => {
  const result = await db.query("SELECT * FROM clientes_fiadores");
  return result.rows;
};

export const getFiadorById = async (id) => {
  const result = await db.query(
    "SELECT * FROM clientes_fiadores WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

export const createFiador = async (nombre, telefono, direccion, saldo_pendiente, limite_credito) => {
    saldo_pendiente = saldo_pendiente ?? null;
    limite_credito = limite_credito ?? null;
  
    try {
      const result = await db.query(
        'INSERT INTO clientes_fiadores (nombre, telefono, direccion, saldo_pendiente, limite_credito) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nombre, telefono, direccion, saldo_pendiente, limite_credito]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error al crear fiador:', error);
      throw new Error('No se pudo crear el fiador');
    }
  };

// Actualizar Fiador
export const updateFiador = async (id, nombre, telefono, direccion, saldo_pendiente, limite_credito) => {
    saldo_pendiente = saldo_pendiente ?? null;
    limite_credito = limite_credito ?? null;
    try {
      const result = await db.query(
        `UPDATE clientes_fiadores 
         SET nombre = $1, telefono = $2, direccion = $3, saldo_pendiente = $4, limite_credito = $5 
         WHERE id = $6 
         RETURNING *`,
        [nombre, telefono, direccion, saldo_pendiente, limite_credito, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error al actualizar fiador:', error);
      throw new Error('No se pudo actualizar el fiador');
    }
  };
  
  // Eliminar Fiador
  export const deleteFiador = async (id) => {
    try {
      const result = await db.query(
        "DELETE FROM clientes_fiadores WHERE id = $1 RETURNING *",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error al eliminar fiador:', error);
      throw new Error('No se pudo eliminar el fiador');
    }
  };
  
  // Obtener Fiadores Deudores
  export const getFiadoresDeudores = async () => {
    try {
      const result = await db.query(
        "SELECT * FROM clientes_fiadores WHERE saldo_pendiente > 0"
      );
      return result.rows;
    } catch (error) {
      console.error('Error al obtener fiadores deudores:', error);
      throw new Error('No se pudo obtener fiadores deudores');
    }
  };
  