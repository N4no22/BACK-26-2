import express from 'express';
import {
  abrirArqueo,
  cerrarArqueo,
  getAllArqueos,
  getArqueoById
} from '../controllers/arqueo_caja.controller.js';

const router = express.Router();

// Abrir arqueo
router.post('/abrir', abrirArqueo);

// Cerrar arqueo
router.post('/cerrar', cerrarArqueo);

// CRUD básico
router.get('/', getAllArqueos);
router.get('/:id', getArqueoById);

export default router;
