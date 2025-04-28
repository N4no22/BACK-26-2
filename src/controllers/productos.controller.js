import {
    getAllProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
  } from '../models/producto.model.js';
  
  export const obtenerProductos = async (req, res) => {
    try {
      const productos = await getAllProductos();
      res.json(productos);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ message: 'Error al obtener productos' });
    }
  };
  
  export const obtenerProductoPorId = async (req, res) => {
    try {
      const producto = await getProductoById(req.params.id);
      if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json(producto);
    } catch (error) {
      console.error('Error al obtener producto:', error);
      res.status(500).json({ message: 'Error al obtener producto' });
    }
  };
  
  export const crearProducto = async (req, res) => {
    try {
      const nuevoProducto = await createProducto(req.body);
      res.status(201).json(nuevoProducto);
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({ message: 'Error al crear producto' });
    }
  };
  
  export const actualizarProducto = async (req, res) => {
    try {
      const productoActualizado = await updateProducto({ ...req.body, id: req.params.id });
      if (!productoActualizado) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json(productoActualizado);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ message: 'Error al actualizar producto' });
    }
  };
  
  export const eliminarProducto = async (req, res) => {
    try {
      const productoEliminado = await deleteProducto(req.params.id);
      if (!productoEliminado) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({ message: 'Error al eliminar producto' });
    }
  };
  