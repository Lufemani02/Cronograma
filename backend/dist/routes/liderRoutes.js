"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const liderController_1 = require("../controllers/liderController");
const router = (0, express_1.Router)();
router.get('/datos', authMiddleware_1.authMiddleware, liderController_1.obtenerDatosDelLider);
router.get('/miembros', authMiddleware_1.authMiddleware, liderController_1.obtenerMiembrosPorDepartamento);
router.get('/tareas', authMiddleware_1.authMiddleware, liderController_1.obtenerTareasPorDepartamento);
exports.default = router;
//# sourceMappingURL=liderRoutes.js.map