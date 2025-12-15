"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
// Departamentos
router.get('/departamentos', adminController_1.obtenerDepartamentos);
router.post('/departamentos', adminController_1.crearDepartamento);
exports.default = router;
// Miembros y líderes
router.post('/miembros', adminController_1.crearMiembro);
router.post('/lideres', adminController_1.crearLider);
// Asignaciones
router.post('/asignar', adminController_1.asignarMiembroADepartamento);
// Tareas
router.post('/tareas', adminController_1.crearTarea);
//# sourceMappingURL=adminRoutes.js.map