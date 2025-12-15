"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const login = async (req, res) => {
    try {
        const { correo, contraseña, rol } = req.body;
        // Validación mínima
        if (!correo || !contraseña || !rol) {
            return res.status(400).json({ error: 'Faltan datos' });
        }
        if (rol !== 'admin' && rol !== 'lider') {
            return res.status(400).json({ error: 'Rol inválido' });
        }
        // Buscar cualquier usuario líder
        const [rows] = await db_1.default.query('SELECT id, nombre, correo FROM usuario WHERE correo = ? AND es_lider = 1', [correo]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        const user = rows[0];
        // ✅ Solo Ana (id=1) puede ser admin
        if (rol === 'admin' && user.id !== 1) {
            return res.status(403).json({ error: 'Solo Ana puede ser admin' });
        }
        // ✅ Todos usan "lider123" → validación simple
        if (contraseña !== 'lider123') {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        // ✅ Generar token
        const token = jsonwebtoken_1.default.sign({ id: user.id, nombre: user.nombre, rol }, process.env.JWT_SECRET || 'ipuc_secret', { expiresIn: '24h' });
        res.json({
            token,
            usuario: { id: user.id, nombre: user.nombre, correo: user.correo, rol }
        });
    }
    catch (error) {
        console.error('💥 Error:', error);
        res.status(500).json({ error: 'Error interno' });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map