"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearMiembro = exports.obtenerUsuarios = void 0;
const db_1 = __importDefault(require("../config/db"));
const obtenerUsuarios = async (req, res) => {
    try {
        const [rows] = await db_1.default.query(`
      SELECT id, nombre, correo, telefono, es_lider, activo 
      FROM usuario 
      ORDER BY nombre
    `);
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};
exports.obtenerUsuarios = obtenerUsuarios;
const crearMiembro = async (req, res) => {
    try {
        const { nombre, correo, telefono } = req.body;
        // Validación básica
        if (!nombre || !correo) {
            return res.status(400).json({ error: 'Nombre y correo son requeridos' });
        }
        // Inserta como miembro (es_lider = false)
        const [result] = await db_1.default.query('INSERT INTO usuario (nombre, correo, telefono, es_lider) VALUES (?, ?, ?, FALSE)', [nombre, correo, telefono]);
        res.status(201).json({
            id: result.insertId,
            nombre,
            correo,
            telefono,
            es_lider: false
        });
    }
    catch (error) {
        console.error('Error crearMiembro:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El correo ya está registrado' });
        }
        res.status(500).json({ error: 'Error al crear miembro' });
    }
};
exports.crearMiembro = crearMiembro;
//# sourceMappingURL=usuarioController.js.map