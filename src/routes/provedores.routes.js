import express from 'express'
import {
    obtenerProveedores,
    obtenerProveedorPorId,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
  } from '../controllers/provedores.controller.js';

  const router = express.Router();

  router.get('/', obtenerProveedores); // Obtener todos los productos
  router.get('/:id', obtenerProveedorPorId); // Obtener un producto por ID
  router.post('/', crearProveedor); // Crear nuevo producto
  router.put('/:id', actualizarProveedor); // Actualizar producto existente
  router.delete('/:id', eliminarProveedor); // Eliminar producto
  
  export default router;