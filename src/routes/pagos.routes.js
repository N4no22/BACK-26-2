
import { Router } from 'express';
import {
  obtenerPagos,
  obtenerPagosPorCliente,
  crearPagoFiado
} from '../controllers/pagos.controller.js';

const router = Router();

router.get('/', obtenerPagos); // GET /pagos
router.get('/:clienteId', obtenerPagosPorCliente); // GET /pagos/:clienteId
router.post('/', crearPagoFiado); // POST /pagos

export default router;

