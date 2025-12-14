import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { obtenerDatosDelLider, obtenerMiembrosPorDepartamento,
  obtenerTareasPorDepartamento } from '../controllers/liderController';

const router = Router();

router.get('/datos', authMiddleware, obtenerDatosDelLider);
router.get('/miembros', authMiddleware, obtenerMiembrosPorDepartamento);
router.get('/tareas', authMiddleware, obtenerTareasPorDepartamento);

export default router;