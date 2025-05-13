// src/routes/descuentos.routes.js
import express from 'express';
const router = express.Router();
import {
  getAllDescuentos,
  getDescuentoById,
  createDescuento,
  updateDescuento,
  deleteDescuento,
} from '../controllers/descuentos.controller.js';

// Rutas para descuentos
router.get('/', getAllDescuentos); // Obtener todos los descuentos
router.get('/:id', getDescuentoById); // Obtener descuento por ID
router.post('/', createDescuento); // Crear un nuevo descuento
router.put('/:id', updateDescuento); // Actualizar un descuento
router.delete('/:id', deleteDescuento); // Eliminar un descuento

export default router;  // Exportación por defecto
