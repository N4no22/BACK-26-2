// src/routes/usuarios.routes.js
import express from 'express';
import {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from '../controllers/usuarios.controller.js';

const router = express.Router();

// Rutas para usuarios
router.get('/', getAllUsuarios);  // Obtener todos los usuarios
router.get('/:id', getUsuarioById);  // Obtener usuario por ID
router.post('/', createUsuario);  // Crear un nuevo usuario
router.put('/:id', updateUsuario);  // Actualizar un usuario
router.delete('/:id', deleteUsuario);  // Eliminar un usuario

export default router;
