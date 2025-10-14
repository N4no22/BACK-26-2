import db from '../db.js';

const PagosFiadosModel = {
  obtenerTodos: async () => {
    const result = await db.query('SELECT * FROM pagos_fiados ORDER BY fecha DESC');
    return result.rows;
  },

  obtenerPorCliente: async (clienteId) => {
    const result = await db.query('SELECT * FROM pagos_fiados WHERE cliente_id = $1 ORDER BY fecha DESC', [clienteId]);
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
  },

  crearPagoFiadoConSaldo: async ({ cliente_id, fecha, monto, metodo_pago, venta_id, estado, usuario_id, arqueo_id }) => {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // Insertar pago fiado
      const pagoResult = await client.query(
        `INSERT INTO pagos_fiados 
         (cliente_id, fecha, monto, metodo_pago, venta_id, estado, usuario_id, arqueo_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [cliente_id, fecha, monto, metodo_pago, venta_id, estado, usuario_id, arqueo_id]
      );
      const nuevoPago = pagoResult.rows[0];

      // Actualizar saldo pendiente en clientes_fiadores
      await client.query(
        `UPDATE clientes_fiadores
         SET saldo_pendiente = saldo_pendiente - $1
         WHERE id = $2`,
        [monto, cliente_id]
      );

      await client.query('COMMIT');
      return nuevoPago;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error en crearPagoFiadoConSaldo:', error);
      throw error;
    } finally {
      client.release();
    }
  }
};

export default PagosFiadosModel;

