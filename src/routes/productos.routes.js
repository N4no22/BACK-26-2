import express from 'express';
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productos.controller.js';

const router = express.Router();

router.get('/', obtenerProductos); // Obtener todos los productos
router.get('/:id', obtenerProductoPorId); // Obtener un producto por ID
router.post('/', crearProducto); // Crear nuevo producto
router.put('/:id', actualizarProducto); // Actualizar producto existente
router.delete('/:id', eliminarProducto); // Eliminar producto

export default router;

