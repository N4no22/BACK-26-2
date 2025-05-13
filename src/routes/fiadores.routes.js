import { Router } from 'express';
import {
  obtenerFiadores,
  obtenerFiadorPorId,
  crearFiador,
  actualizarFiador,
  eliminarFiador,
  obtenerFiadoresDeudores
} from '../controllers/fiadores.controller.js';

const router = Router();

// Listar todos los fiadores
router.get('/', obtenerFiadores);

// Obtener un fiador específico
router.get('/:id', obtenerFiadorPorId);

// Crear un nuevo fiador
router.post('/', crearFiador);

// Actualizar un fiador
router.put('/:id', actualizarFiador);

// Eliminar un fiador (opcional)
router.delete('/:id', eliminarFiador);

// Listar fiadores que tienen deuda
router.get('/deudores/listado', obtenerFiadoresDeudores);

export default router;
