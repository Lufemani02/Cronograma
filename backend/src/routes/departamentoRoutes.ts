// backend/src/routes/departamentoRoutes.ts
import { Router } from 'express';
import { obtenerDepartamentosDelLider } from '../controllers/departamentoController';

const router = Router();

// Endpoint: GET /api/departamentos/mios
router.get('/mios', obtenerDepartamentosDelLider);

export default router;