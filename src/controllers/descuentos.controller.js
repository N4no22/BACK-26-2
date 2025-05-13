// src/controllers/descuentos.controller.js
import Descuento from '../models/descuentos.model.js';  // Asegúrate de que el path sea correcto

// Obtener todos los descuentos
export const getAllDescuentos = async (req, res) => {
  try {
    const descuentos = await Descuento.getAll();
    res.status(200).json(descuentos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los descuentos', error: err.message });
  }
};

// Obtener descuento por ID
export const getDescuentoById = async (req, res) => {
  const { id } = req.params;
  try {
    const descuento = await Descuento.getById(id);
    if (descuento) {
      res.status(200).json(descuento);
    } else {
      res.status(404).json({ message: 'Descuento no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el descuento', error: err.message });
  }
};

// Crear un nuevo descuento
export const createDescuento = async (req, res) => {
  const { nombre, tipo, valor, fecha_inicio, fecha_fin } = req.body;
  try {
    const descuento = await Descuento.create({ nombre, tipo, valor, fecha_inicio, fecha_fin });
    res.status(201).json(descuento);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el descuento', error: err.message });
  }
};

// Actualizar un descuento
export const updateDescuento = async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, valor, fecha_inicio, fecha_fin } = req.body;
  try {
    const descuento = await Descuento.update(id, { nombre, tipo, valor, fecha_inicio, fecha_fin });
    if (descuento) {
      res.status(200).json(descuento);
    } else {
      res.status(404).json({ message: 'Descuento no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el descuento', error: err.message });
  }
};

// Eliminar un descuento
export const deleteDescuento = async (req, res) => {
  const { id } = req.params;
  try {
    const descuento = await Descuento.delete(id);
    if (descuento) {
      res.status(200).json({ message: 'Descuento eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Descuento no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el descuento', error: err.message });
  }
};
