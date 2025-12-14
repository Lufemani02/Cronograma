import { Router } from 'express';
import {
  crearDepartamento,
  obtenerDepartamentos,
  crearMiembro,
  crearLider,
  asignarMiembroADepartamento,
  crearTarea
} from '../controllers/adminController';

const router = Router();

// Departamentos
router.get('/departamentos', obtenerDepartamentos)
router.post('/departamentos', crearDepartamento);
export default router;
// Miembros y líderes
router.post('/miembros', crearMiembro);
router.post('/lideres', crearLider);
// Asignaciones
router.post('/asignar', asignarMiembroADepartamento);
// Tareas
router.post('/tareas', crearTarea);
