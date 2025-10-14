// src/models/arqueo_caja.model.js
import db from '../db.js';

const ArqueoCaja = {
  // 1️⃣ Obtener todos los arqueos
  getAll: async () => {
    const result = await db.query('SELECT * FROM arqueo_caja ORDER BY fecha DESC');
    return result.rows;
  },

  // 2️⃣ Obtener arqueo por ID
  getById: async (id) => {
    const result = await db.query('SELECT * FROM arqueo_caja WHERE id = $1', [id]);
    return result.rows[0];
  },

  // 3️⃣ Abrir un nuevo arqueo
  abrirArqueo: async (usuario_id, saldoAnteriorInput) => {
  let saldo_anterior;

  if (typeof saldoAnteriorInput === 'number') {
    saldo_anterior = saldoAnteriorInput;
  } else {
    const lastArqueo = await db.query(`SELECT saldo_final FROM arqueo_caja ORDER BY fecha DESC LIMIT 1`);
    saldo_anterior = lastArqueo.rows[0]?.saldo_final || 0;
  }

  const result = await db.query(
    `INSERT INTO arqueo_caja (fecha, usuario_id, saldo_anterior, ingresos, egresos, saldo_final, estado)
     VALUES (NOW(), $1, $2, 0, 0, $2, 'abierto')
     RETURNING *`,
    [usuario_id, saldo_anterior]
  );

  return result.rows[0];
},


  // 4️⃣ Cerrar arqueo automáticamente
  cerrarArqueo: async () => {
    // Buscar arqueo abierto
    const arqueo = await db.query(`SELECT * FROM arqueo_caja WHERE estado='abierto' ORDER BY fecha DESC LIMIT 1`);
    if (!arqueo.rows.length) throw new Error('No hay arqueo abierto');
    const arqueoId = arqueo.rows[0].id;
    const saldo_anterior = parseFloat(arqueo.rows[0].saldo_anterior);

    // Ingresos: ventas y pagos fiados asociados al arqueo
    const ventas = await db.query(
      `SELECT COALESCE(SUM(total),0) AS total FROM ventas WHERE arqueo_id=$1 AND estado != 'anulada'`,
      [arqueoId]
    );
    const pagosFiados = await db.query(
      `SELECT COALESCE(SUM(monto),0) AS total FROM pagos_fiados WHERE arqueo_id=$1`,
      [arqueoId]
    );
    const ingresos = parseFloat(ventas.rows[0].total) 

    // Egresos (si hay tabla de egresos, sumar aquí)
    const egresos = 0;

    // Saldo final
    const saldo_final = saldo_anterior + ingresos - egresos;

    // Actualizar arqueo
    const result = await db.query(
      `UPDATE arqueo_caja 
       SET ingresos=$1, egresos=$2, saldo_final=$3, estado='cerrado'
       WHERE id=$4
       RETURNING *`,
      [ingresos, egresos, saldo_final, arqueoId]
    );

    return result.rows[0];
  },

  // 5️⃣ Actualizar arqueo manual (opcional)
  update: async (id, arqueo) => {
    const { fecha, usuario_id, saldo_anterior, ingresos, egresos, saldo_final, estado } = arqueo;
    const result = await db.query(
      `UPDATE arqueo_caja
       SET fecha=$1, usuario_id=$2, saldo_anterior=$3, ingresos=$4, egresos=$5, saldo_final=$6, estado=$7
       WHERE id=$8
       RETURNING *`,
      [fecha, usuario_id, saldo_anterior, ingresos, egresos, saldo_final, estado, id]
    );
    return result.rows[0];
  },

  // 6️⃣ Eliminar arqueo
  delete: async (id) => {
    const result = await db.query('DELETE FROM arqueo_caja WHERE id=$1 RETURNING *', [id]);
    return result.rows[0];
  }
};

export default ArqueoCaja;
