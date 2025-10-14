import {
  getAllVentas,
  getVentaById,
  updateVenta,
  deleteVenta,
  crearVentaCompleta
} from '../models/ventas.model.js';

// Obtener todas las ventas
export const obtenerVentas = async (req, res) => {
  try {
    const ventas = await getAllVentas();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas' });
  }
};

// Obtener una venta por ID
export const obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await getVentaById(req.params.id);
    if (!venta) return res.status(404).json({ message: 'Venta no encontrada' });
    res.json(venta);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener venta' });
  }
};

// Actualizar una venta existente
export const actualizarVenta = async (req, res) => {
  const { fecha, cliente_id, metodo_pago, estado, total, saldo_pendiente, usuario_id, arqueo_id } = req.body;
  try {
    const ventaActualizada = await updateVenta(
      req.params.id,
      fecha, cliente_id, metodo_pago, estado, total, saldo_pendiente, usuario_id, arqueo_id
    );
    res.json(ventaActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar venta' });
  }
};

// Eliminar una venta
export const eliminarVenta = async (req, res) => {
  try {
    const ventaEliminada = await deleteVenta(req.params.id);
    res.json(ventaEliminada);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar venta' });
  }
};

// ✅ Crear venta completa con detalles, stock y fiado
export const crearVenta = async (req, res) => {
  try {
    const nuevaVenta = await crearVentaCompleta(req.body);
    res.status(201).json(nuevaVenta);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear venta completa' });
  }
};
