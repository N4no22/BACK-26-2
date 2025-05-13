import * as FiadorModel from '../models/fiadores.model.js';

export const obtenerFiadores = async (req, res) => {
  try {
    const fiadores = await FiadorModel.getAllFiadores();
    res.json(fiadores);
  } catch (error) {
    console.error('Error al obtener fiadores:', error);
    res.status(500).json({ message: 'Error al obtener fiadores' });
  }
};

export const obtenerFiadorPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const fiador = await FiadorModel.getFiadorById(id);
    if (!fiador) {
      return res.status(404).json({ message: 'Fiador no encontrado' });
    }
    res.json(fiador);
  } catch (error) {
    console.error('Error al obtener fiador:', error);
    res.status(500).json({ message: 'Error al obtener fiador' });
  }
};

export const crearFiador = async (req, res) => {
    const { nombre, telefono, direccion, saldo_pendiente, limite_credito } = req.body;  // 👈 Nombres correctos
    try {
      const nuevoFiador = await FiadorModel.createFiador(nombre, telefono, direccion, saldo_pendiente, limite_credito); // 👈 Pasa los 5 valores
      res.status(201).json(nuevoFiador);
    } catch (error) {
      console.error('Error al crear fiador:', error);
      res.status(500).json({ message: 'Error al crear fiador' });
    }
  };
  

// Actualizar Fiador
export const actualizarFiador = async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, direccion, saldo_pendiente, limite_credito } = req.body; // 👈 corregido
    try {
      const fiadorActualizado = await FiadorModel.updateFiador(id, nombre, telefono, direccion, saldo_pendiente, limite_credito); // 👈 pasa los 5
      if (!fiadorActualizado) {
        return res.status(404).json({ message: 'Fiador no encontrado' });
      }
      res.json(fiadorActualizado);
    } catch (error) {
      console.error('Error al actualizar fiador:', error);
      res.status(500).json({ message: 'Error al actualizar fiador' });
    }
  };
  
  // Eliminar Fiador
  export const eliminarFiador = async (req, res) => {
    const { id } = req.params;
    try {
      const fiadorEliminado = await FiadorModel.deleteFiador(id);
      if (!fiadorEliminado) {
        return res.status(404).json({ message: 'Fiador no encontrado' });
      }
      res.json({ message: 'Fiador eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar fiador:', error);
      res.status(500).json({ message: 'Error al eliminar fiador' });
    }
  };
  
  // Obtener Fiadores Deudores
  export const obtenerFiadoresDeudores = async (req, res) => {
    try {
      const deudores = await FiadorModel.getFiadoresDeudores();
      res.json(deudores);
    } catch (error) {
      console.error('Error al obtener fiadores deudores:', error);
      res.status(500).json({ message: 'Error al obtener fiadores deudores' });
    }
  };
  