// src/controllers/ventas.controller.js

import db from '../db.js';
import { queriesVentas } from '../models/ventas.model.js';

// Obtener todas las ventas
export const obtenerVentas = async (req, res) => {
  try {
    const result = await db.query(queriesVentas.obtenerTodos);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ message: 'Error al obtener ventas' });
  }
};

// Obtener una venta por ID
export const obtenerVentaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(queriesVentas.obtenerPorId, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener venta:', error);
    res.status(500).json({ message: 'Error al obtener venta' });
  }
};

// Crear una nueva venta
export const crearVenta = async (req, res) => {
  const { fecha, cliente_id, metodo_pago, estado, total, saldo_pendiente, usuario_id, arqueo_id } = req.body;
  try {
    const result = await db.query(queriesVentas.crear, [
      fecha,
      cliente_id,
      metodo_pago,
      estado,
      total,
      saldo_pendiente,
      usuario_id,
      arqueo_id
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear venta:', error);
    res.status(500).json({ message: 'Error al crear venta' });
  }
};

// Actualizar una venta
export const actualizarVenta = async (req, res) => {
  const { id } = req.params;
  const { fecha, cliente_id, metodo_pago, estado, total, saldo_pendiente, usuario_id, arqueo_id } = req.body;
  try {
    const result = await db.query(queriesVentas.actualizar, [
      fecha,
      cliente_id,
      metodo_pago,
      estado,
      total,
      saldo_pendiente,
      usuario_id,
      arqueo_id,
      id
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar venta:', error);
    res.status(500).json({ message: 'Error al actualizar venta' });
  }
};

// Eliminar una venta
export const eliminarVenta = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(queriesVentas.eliminar, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.json({ message: 'Venta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar venta:', error);
    res.status(500).json({ message: 'Error al eliminar venta' });
  }
};
