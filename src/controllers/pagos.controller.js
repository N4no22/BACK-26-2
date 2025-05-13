import PagosFiadosModel from '../models/pagos.model.js';

// Obtener todos los pagos fiados
export const obtenerPagos = async (req, res) => {
  try {
    const pagos = await PagosFiadosModel.obtenerTodos();
    res.json(pagos);
  } catch (error) {
    console.error('Error al obtener pagos fiados:', error);
    res.status(500).json({ message: 'Error al obtener pagos fiados' });
  }
};

// Obtener pagos por cliente
export const obtenerPagosPorCliente = async (req, res) => {
  const { clienteId } = req.params;
  try {
    const pagos = await PagosFiadosModel.obtenerPorCliente(clienteId);
    res.json(pagos);
  } catch (error) {
    console.error('Error al obtener pagos del cliente:', error);
    res.status(500).json({ message: 'Error al obtener pagos del cliente' });
  }
};

// Crear nuevo pago fiado
export const crearPagoFiado = async (req, res) => {
  const nuevoPago = req.body;
  try {
    const pagoCreado = await PagosFiadosModel.crear(nuevoPago);
    res.status(201).json(pagoCreado);
  } catch (error) {
    console.error('Error al crear pago fiado:', error);
    res.status(500).json({ message: 'Error al crear pago fiado' });
  }
};
