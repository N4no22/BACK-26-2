// src/routes/arqueo_caja.routes.js
import express from 'express';
import {
  getAllArqueos,
  getArqueoById,
  createArqueo,
  updateArqueo,
  deleteArqueo,
} from '../controllers/arqueo_caja.controller.js';

const router = express.Router();

// Rutas para arqueo de caja
router.get('/', getAllArqueos);  // Obtener todos los arqueos
router.get('/:id', getArqueoById);  // Obtener arqueo por ID
router.post('/', createArqueo);  // Crear un nuevo arqueo
router.put('/:id', updateArqueo);  // Actualizar un arqueo
router.delete('/:id', deleteArqueo);  // Eliminar un arqueo

export default router;
