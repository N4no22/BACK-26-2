// src/controllers/movimientosStock.controller.js
import db from '../db.js';

// Obtener todos los movimientos de stock
export const obtenerMovimientosStock = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM movimientos_stock ORDER BY fecha DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener movimientos de stock:', error);
    res.status(500).json({ message: 'Error al obtener movimientos de stock' });
  }
};

// Obtener un movimiento por ID
export const obtenerMovimientoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM movimientos_stock WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener el movimiento:', error);
    res.status(500).json({ message: 'Error al obtener el movimiento' });
  }
};

// Crear un nuevo movimiento
export const crearMovimientoStock = async (req, res) => {
  const { producto_id, tipo, cantidad, fecha, motivo, usuario_id } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO movimientos_stock 
        (producto_id, tipo, cantidad, fecha, motivo, usuario_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
      [producto_id, tipo, cantidad, fecha, motivo, usuario_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear movimiento:', error);
    res.status(500).json({ message: 'Error al crear movimiento' });
  }
};

// Eliminar un movimiento (opcional)
export const eliminarMovimientoStock = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM movimientos_stock WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }
    res.json({ message: 'Movimiento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar movimiento:', error);
    res.status(500).json({ message: 'Error al eliminar movimiento' });
  }
};
