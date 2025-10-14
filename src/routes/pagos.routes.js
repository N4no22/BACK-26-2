import { Router } from 'express';
import {
  obtenerPagos,
  obtenerPagosPorCliente,
  crearPagoFiado
} from '../controllers/pagos.controller.js';

const router = Router();

router.get('/', obtenerPagos);
router.get('/cliente/:clienteId', obtenerPagosPorCliente);
router.post('/', crearPagoFiado);

export default router;

