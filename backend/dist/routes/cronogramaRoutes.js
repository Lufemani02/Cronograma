"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const cronogramaController_1 = require("../controllers/cronogramaController");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.authMiddleware, cronogramaController_1.asignarCronograma);
router.get('/mes', authMiddleware_1.authMiddleware, cronogramaController_1.obtenerCronogramaDelMes);
exports.default = router;
//# sourceMappingURL=cronogramaRoutes.js.map