// src/routes/movimientosStock.routes.js
import { Router } from 'express';
import {
  obtenerMovimientosStock,
  obtenerMovimientoPorId,
  crearMovimientoStock,
  eliminarMovimientoStock
} from '../controllers/movimientosStock.controller.js';

const router = Router();

// Listar todos los movimientos de stock
router.get('/', obtenerMovimientosStock);

// Obtener un movimiento específico
router.get('/:id', obtenerMovimientoPorId);

// Crear un nuevo movimiento
router.post('/', crearMovimientoStock);

// Actualizar un movimiento de stock

// Eliminar un movimiento de stock
router.delete('/:id', eliminarMovimientoStock);

export default router;
