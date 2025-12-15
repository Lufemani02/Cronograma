"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/departamentoRoutes.ts
const express_1 = require("express");
const departamentoController_1 = require("../controllers/departamentoController");
const router = (0, express_1.Router)();
// Endpoint: GET /api/departamentos/mios
router.get('/mios', departamentoController_1.obtenerDepartamentosDelLider);
exports.default = router;
//# sourceMappingURL=departamentoRoutes.js.map