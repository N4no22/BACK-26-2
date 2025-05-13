import { obtenerResumenDashboard } from '../models/dashboard.model.js';

export const getResumenDashboard = async (req, res) => {
  try {
    const resumen = await obtenerResumenDashboard();
    res.json(resumen);
  } catch (error) {
    console.error('Error en resumen del dashboard:', error);
    res.status(500).json({ message: 'Error al obtener resumen del dashboard' });
  }
};
import db from '../db.js';

// Total de ventas del día
//export const obtenerResumenDashboard = async (req, res) => {
 //