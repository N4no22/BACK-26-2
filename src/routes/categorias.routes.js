import express from 'express';
import { obtenerCategorias, obtenerCategoriaPorId, crearCategoria, actualizarCategoria, eliminarCategoria } from '../controllers/categorias.controller.js';

const router = express.Router();

// Ruta para obtener todas las categorías
router.get('/', obtenerCategorias);

router.get('/:id', obtenerCategoriaPorId);  // Asegúrate de que esta línea esté presente

// Ruta para crear una nueva categoría
router.post('/', crearCategoria);

// Ruta para actualizar una categoría existente
router.put('/:id', actualizarCategoria);

// Ruta para eliminar una categoría
router.delete('/:id', eliminarCategoria);

export default router;
