// src/controllers/arqueo_caja.controller.js
import ArqueoCaja from '../models/arqueo_caja.model.js';

// Obtener todos los arqueos de caja
export const getAllArqueos = async (req, res) => {
  try {
    const arqueos = await ArqueoCaja.getAll();
    res.status(200).json(arqueos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los arqueos de caja', error: err.message });
  }
};

// Obtener arqueo de caja por ID
export const getArqueoById = async (req, res) => {
  const { id } = req.params;
  try {
    const arqueo = await ArqueoCaja.getById(id);
    if (arqueo) {
      res.status(200).json(arqueo);
    } else {
      res.status(404).json({ message: 'Arqueo de caja no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el arqueo de caja', error: err.message });
  }
};

// Crear un nuevo arqueo de caja
export const createArqueo = async (req, res) => {
  const { fecha, usuario_id, saldo_anterior, ingresos, egresos, saldo_final, estado } = req.body;
  try {
    const arqueo = await ArqueoCaja.create({ fecha, usuario_id, saldo_anterior, ingresos, egresos, saldo_final, estado });
    res.status(201).json(arqueo);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el arqueo de caja', error: err.message });
  }
};

// Actualizar un arqueo de caja
export const updateArqueo = async (req, res) => {
  const { id } = req.params;
  const { fecha, usuario_id, saldo_anterior, ingresos, egresos, saldo_final, estado } = req.body;
  try {
    const arqueo = await ArqueoCaja.update(id, { fecha, usuario_id, saldo_anterior, ingresos, egresos, saldo_final, estado });
    if (arqueo) {
      res.status(200).json(arqueo);
    } else {
      res.status(404).json({ message: 'Arqueo de caja no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el arqueo de caja', error: err.message });
  }
};

// Eliminar un arqueo de caja
export const deleteArqueo = async (req, res) => {
  const { id } = req.params;
  try {
    const arqueo = await ArqueoCaja.delete(id);
    if (arqueo) {
      res.status(200).json({ message: 'Arqueo de caja eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Arqueo de caja no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el arqueo de caja', error: err.message });
  }
};
