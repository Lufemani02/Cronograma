import { Router } from 'express';
import { obtenerUsuarios, crearMiembro} from '../controllers/usuarioController';


const router = Router();

router.get('/', obtenerUsuarios); // GET /api/usuarios
router.post('/', crearMiembro); // POST /api/usuarios/miembros

export default router;