"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioController_1 = require("../controllers/usuarioController");
const router = (0, express_1.Router)();
router.get('/', usuarioController_1.obtenerUsuarios); // GET /api/usuarios
router.post('/', usuarioController_1.crearMiembro); // POST /api/usuarios/miembros
exports.default = router;
//# sourceMappingURL=usuarioRoutes.js.map