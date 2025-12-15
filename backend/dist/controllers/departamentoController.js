"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerDepartamentosDelLider = void 0;
const db_1 = __importDefault(require("../config/db"));
const obtenerDepartamentosDelLider = async (req, res) => {
    try {
        const usuarioId = 1;
        ; // viene del authMiddleware
        const [rows] = await db_1.default.query(`
      SELECT d.id, d.nombre, d.descripcion
      FROM departamento d
      INNER JOIN usuario_departamento ud ON d.id = ud.departamento_id
      WHERE ud.usuario_id = ?
      ORDER BY d.nombre
    `, [usuarioId]);
        res.json(rows);
    }
    catch (error) {
        console.error('💥 ERROR REAL:', error.message);
        console.error('SQL:', error.sql);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: error.message }); // ← para verlo en navegador
    }
};
exports.obtenerDepartamentosDelLider = obtenerDepartamentosDelLider;
//# sourceMappingURL=departamentoController.js.map