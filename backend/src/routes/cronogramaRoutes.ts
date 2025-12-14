import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { asignarCronograma, obtenerCronogramaDelMes } from '../controllers/cronogramaController';

const router = Router();

router.post('/', authMiddleware, asignarCronograma);
router.get('/mes', authMiddleware, obtenerCronogramaDelMes);

export default router;