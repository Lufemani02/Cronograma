"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearTarea = exports.obtenerTareasPorDepartamento = exports.obtenerMiembrosPorDepartamento = exports.asignarMiembroADepartamento = exports.crearLider = exports.crearMiembro = exports.crearDepartamento = exports.obtenerDepartamentos = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
// --- DEPARTAMENTOS ---
const obtenerDepartamentos = async (req, res) => {
    try {
        const [rows] = await db_1.default.query('SELECT * FROM departamento ORDER BY nombre');
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener departamentos' });
    }
};
exports.obtenerDepartamentos = obtenerDepartamentos;
const crearDepartamento = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        if (!nombre)
            return res.status(400).json({ error: 'Nombre requerido' });
        const [result] = await db_1.default.query('INSERT INTO departamento (nombre, descripcion, creado_en) VALUES (?, ?, NOW())', [nombre, descripcion || null]);
        res.status(201).json({ id: result.insertId, nombre, descripcion });
    }
    catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Departamento ya existe' });
        }
        res.status(500).json({ error: 'Error al crear departamento' });
    }
};
exports.crearDepartamento = crearDepartamento;
// --- MIEMBROS ---
const crearMiembro = async (req, res) => {
    try {
        const { nombre, correo, telefono } = req.body;
        if (!nombre || !correo)
            return res.status(400).json({ error: 'Nombre y correo requeridos' });
        const [result] = await db_1.default.query('INSERT INTO usuario (nombre, correo, telefono, es_lider) VALUES (?, ?, ?, FALSE)', [nombre, correo, telefono || null]);
        res.status(201).json({ id: result.insertId, nombre, correo, telefono, es_lider: false });
    }
    catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Correo ya registrado' });
        }
        res.status(500).json({ error: 'Error al crear miembro' });
    }
};
exports.crearMiembro = crearMiembro;
// --- LÍDERES ---
const crearLider = async (req, res) => {
    try {
        const { nombre, correo, contraseña, departamento_ids = [] } = req.body;
        if (!nombre || !correo || !contraseña) {
            return res.status(400).json({ error: 'Nombre, correo y contraseña requeridos' });
        }
        // ✅ Genera hash de la contraseña que TÚ defines
        const hash = await bcrypt.hash(contraseña, 10);
        const [result] = await db_1.default.query('INSERT INTO usuario (nombre, correo, contraseña_hash, es_lider) VALUES (?, ?, ?, TRUE)', [nombre, correo, hash]);
        const liderId = result.insertId;
        // Asignar a departamentos
        if (Array.isArray(departamento_ids) && departamento_ids.length > 0) {
            const asignaciones = departamento_ids.map(id => [liderId, Number(id)]);
            await db_1.default.query('INSERT INTO usuario_departamento (usuario_id, departamento_id) VALUES ?', [asignaciones]);
        }
        res.status(201).json({
            id: liderId,
            nombre,
            correo
        });
    }
    catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Correo ya registrado' });
        }
        console.error('Error crearLider:', error);
        res.status(500).json({ error: 'Error al crear líder' });
    }
};
exports.crearLider = crearLider;
// --- ASIGNAR MIEMBRO A DEPARTAMENTO ---
const asignarMiembroADepartamento = async (req, res) => {
    try {
        const { usuario_id, departamento_id } = req.body;
        if (!usuario_id || !departamento_id) {
            return res.status(400).json({ error: 'usuario_id y departamento_id requeridos' });
        }
        await db_1.default.query('INSERT INTO usuario_departamento (usuario_id, departamento_id) VALUES (?, ?)', [usuario_id, departamento_id]);
        res.status(201).json({ mensaje: 'Asignación creada' });
    }
    catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ya asignado a este departamento' });
        }
        res.status(500).json({ error: 'Error al asignar' });
    }
};
exports.asignarMiembroADepartamento = asignarMiembroADepartamento;
// --- MIEMBROS Y TAREAS POR DEPARTAMENTO (para líder) ---
const obtenerMiembrosPorDepartamento = async (req, res) => {
    try {
        const { departamento_id } = req.query;
        if (!departamento_id) {
            return res.status(400).json({ error: 'departamento_id requerido' });
        }
        const [rows] = await db_1.default.query(`
      SELECT u.id, u.nombre
      FROM usuario u
      INNER JOIN usuario_departamento ud ON u.id = ud.usuario_id
      WHERE ud.departamento_id = ? AND u.es_lider = FALSE
      ORDER BY u.nombre
    `, [departamento_id]);
        res.json(rows);
    }
    catch (error) {
        console.error('Error obtenerMiembrosPorDepartamento:', error);
        res.status(500).json({ error: 'Error al cargar miembros' });
    }
};
exports.obtenerMiembrosPorDepartamento = obtenerMiembrosPorDepartamento;
const obtenerTareasPorDepartamento = async (req, res) => {
    try {
        const { departamento_id } = req.query;
        if (!departamento_id) {
            return res.status(400).json({ error: 'departamento_id requerido' });
        }
        const [rows] = await db_1.default.query(`
      SELECT id, nombre
      FROM tarea
      WHERE departamento_id = ? AND activo = TRUE
      ORDER BY nombre
    `, [departamento_id]);
        res.json(rows);
    }
    catch (error) {
        console.error('Error obtenerTareasPorDepartamento:', error);
        res.status(500).json({ error: 'Error al cargar tareas' });
    }
};
exports.obtenerTareasPorDepartamento = obtenerTareasPorDepartamento;
// --- CREAR TAREA ---
const crearTarea = async (req, res) => {
    try {
        const { nombre, departamento_id } = req.body;
        if (!nombre || !departamento_id) {
            return res.status(400).json({ error: 'Nombre y departamento_id requeridos' });
        }
        const [result] = await db_1.default.query('INSERT INTO tarea (nombre, departamento_id) VALUES (?, ?)', [nombre.trim(), Number(departamento_id)]);
        res.status(201).json({
            id: result.insertId,
            nombre: nombre.trim(),
            departamento_id: Number(departamento_id)
        });
    }
    catch (error) {
        console.error('💥 Error crearTarea:', error.code, error.message);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'El departamento no existe' });
        }
        if (error.code === 'ER_BAD_NULL_ERROR') {
            return res.status(400).json({ error: 'departamento_id no puede ser nulo' });
        }
        res.status(500).json({ error: 'Error al crear tarea' });
    }
};
exports.crearTarea = crearTarea;
//# sourceMappingURL=adminController.js.map