import * as ProveedorModel from '../models/proveedores.model.js';

export const obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await ProveedorModel.getAllProveedores();
    res.json(proveedores);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ message: 'Error al obtener proveedores' });
  }
};

export const obtenerProveedorPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const proveedor = await ProveedorModel.getProveedorById(id);
    if (!proveedor) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.json(proveedor);
  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    res.status(500).json({ message: 'Error al obtener proveedor' });
  }
};

export const crearProveedor = async (req, res) => {
  const { nombre, contacto, telefono, direccion } = req.body;
  try {
    const nuevoProveedor = await ProveedorModel.createProveedor(nombre, contacto, telefono, direccion);
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ message: 'Error al crear proveedor' });
  }
};

export const actualizarProveedor = async (req, res) => {
  const { id } = req.params;
  const { nombre, contacto, telefono, direccion } = req.body;
  try {
    const proveedorActualizado = await ProveedorModel.updateProveedor(id, nombre, contacto, telefono, direccion);
    if (!proveedorActualizado) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.json(proveedorActualizado);
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ message: 'Error al actualizar proveedor' });
  }
};

export const eliminarProveedor = async (req, res) => {
  const { id } = req.params;
  try {
    const proveedorEliminado = await ProveedorModel.deleteProveedor(id);
    if (!proveedorEliminado) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.json({ message: 'Proveedor eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ message: 'Error al eliminar proveedor' });
  }
};
