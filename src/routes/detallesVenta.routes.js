import { Router } from 'express';
import {
  crearDetalleVenta,
  obtenerDetallesVenta,
  eliminarDetalleVenta
} from '../controllers/detallesVenta.controller.js';

const router = Router();

router.post('/', crearDetalleVenta);
router.get('/:ventaId', obtenerDetallesVenta);
router.delete('/:id', eliminarDetalleVenta);

export default router;
