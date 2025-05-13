import express from 'express';
import { getResumenDashboard } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/resumen', getResumenDashboard);
//router.get('/resumen', obtenerResumenDashboard);//


export default router;





