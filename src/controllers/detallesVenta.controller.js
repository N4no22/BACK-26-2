import db from '../db.js';
import DetalleVentaModel from '../models/detallesVenta.model.js';

export const crearDetalleVenta = async (req, res) => {
  try {
    const nuevoDetalle = await DetalleVentaModel.crearDetalleVenta(db, req.body);
    res.status(201).json(nuevoDetalle);
  } catch (error) {
    console.error('Error al crear detalle de venta:', error);
    res.status(500).json({ message: 'Error al crear detalle de venta' });
  }
};

export const obtenerDetallesVenta = async (req, res) => {
  const { ventaId } = req.params;
  try {
    const detalles = await DetalleVentaModel.obtenerDetallesPorVenta(db, ventaId);
    res.json(detalles);
  } catch (error) {
    console.error('Error al obtener detalles de venta:', error);
    res.status(500).json({ message: 'Error al obtener detalles de venta' });
  }
};

export const eliminarDetalleVenta = async (req, res) => {
  const { id } = req.params;
  try {
    const detalleEliminado = await DetalleVentaModel.eliminarDetallePorId(db, id);
    if (!detalleEliminado) {
      return res.status(404).json({ message: 'Detalle no encontrado' });
    }
    res.json({ message: 'Detalle eliminado' });
  } catch (error) {
    console.error('Error al eliminar detalle:', error);
    res.status(500).json({ message: 'Error al eliminar detalle' });
  }
};
