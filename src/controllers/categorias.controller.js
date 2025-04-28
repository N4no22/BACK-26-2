// src/controllers/categorias.controller.js
import db from '../db.js';
import CATEGORIAS_QUERIES from '../models/categorias.model.js';

// Obtener todas
export const obtenerCategorias = async (req, res) => {
  try {
    const result = await db.query(CATEGORIAS_QUERIES.OBTENER_TODAS);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
};

// Obtener por ID
export const obtenerCategoriaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(CATEGORIAS_QUERIES.OBTENER_POR_ID, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ message: 'Error al obtener categoría' });
  }
};

// Crear nueva
export const crearCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    const result = await db.query(CATEGORIAS_QUERIES.CREAR, [nombre]);
    if (result.rows.length > 0) {
      res.status(201).json({
        message: 'Categoría creada correctamente',
        categoria: result.rows[0]
      });
    } else {
      res.status(400).json({ message: 'No se pudo crear la categoría' });
    }
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ message: 'Error al crear categoría' });
  }
};

// Actualizar
export const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const result = await db.query(CATEGORIAS_QUERIES.ACTUALIZAR, [nombre, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json({
      message: 'Categoría actualizada correctamente',
      categoria: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ message: 'Error al actualizar categoría' });
  }
};

// Eliminar
export const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(CATEGORIAS_QUERIES.ELIMINAR, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ message: 'Error al eliminar categoría' });
  }
};
