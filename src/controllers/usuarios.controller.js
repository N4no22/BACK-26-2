// src/controllers/usuarios.controller.js
import Usuario from '../models/usuarios.model.js';
import jwt from "jsonwebtoken";


export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.getByEmail(email);

    if (!usuario) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    if (usuario.password !== password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // 🔥 CREAR TOKEN
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email
      },
      "secreto_super_pos", // después lo pasamos a .env
      { expiresIn: "1h" }
    );

    // 🔥 RESPUESTA PRO
    res.json({
      message: "Login correcto",
      usuario,
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Obtener todos los usuarios
export const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.getAll();
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: err.message });
  }
};

// Obtener usuario por ID
export const getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.getById(id);
    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: err.message });
  }
};

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.create({ email, password });
    res.status(201).json(usuario);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el usuario', error: err.message });
  }
};

// Actualizar un usuario
export const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.update(id, { email, password });
    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error: err.message });
  }
};

// Eliminar un usuario
export const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.delete(id);
    if (usuario) {
      res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error: err.message });
  }
};
