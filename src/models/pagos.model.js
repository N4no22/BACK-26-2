import db from '../db.js';

const PagosFiadosModel = {
  obtenerTodos: async () => {
    const result = await db.query('SELECT * FROM pagos_fiados');
    return result.rows;
  },

  obtenerPorCliente: async (clienteId) => {
    const result = await db.query('SELECT * FROM pagos_fiados WHERE cliente_id = $1', [clienteId]);
    return result.rows;
  },

  crear: async ({ cliente_id, fecha, monto, metodo_pago, venta_id, estado, usuario_id, arqueo_id }) => {
    const result = await db.query(
      `INSERT INTO pagos_fiados 
      (cliente_id, fecha, monto, metodo_pago, venta_id, estado, usuario_id, arqueo_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [cliente_id, fecha, monto, metodo_pago, venta_id, estado, usuario_id, arqueo_id]
    );
    return result.rows[0];
  }
};

export default PagosFiadosModel;
