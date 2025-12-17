import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import pool from '../config/db';

// --- DEPARTAMENTOS ---
export const obtenerDepartamentos = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM departamento ORDER BY nombre');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener departamentos' });
  }
};

export const crearDepartamento = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });

    const [result]: any = await pool.query(
      'INSERT INTO departamento (nombre, descripcion, creado_en) VALUES (?, ?, NOW())',
      [nombre, descripcion || null]
    );

    res.status(201).json({ id: result.insertId, nombre, descripcion });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Departamento ya existe' });
    }
    res.status(500).json({ error: 'Error al crear departamento' });
  }
};

// --- MIEMBROS ---
export const crearMiembro = async (req: Request, res: Response) => {
  try {
    const { nombre, correo, telefono } = req.body;
    if (!nombre || !correo) return res.status(400).json({ error: 'Nombre y correo requeridos' });

    const [result]: any = await pool.query(
      'INSERT INTO usuario (nombre, correo, telefono, es_lider) VALUES (?, ?, ?, FALSE)',
      [nombre, correo, telefono || null]
    );

    res.status(201).json({ id: result.insertId, nombre, correo, telefono, es_lider: false });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Correo ya registrado' });
    }
    res.status(500).json({ error: 'Error al crear miembro' });
  }
};

// --- LÍDERES ---
export const crearLider = async (req: Request, res: Response) => {
  try {
    const { nombre, correo, contraseña, departamento_ids = [] } = req.body;
    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña requeridos' });
    }

    // ✅ Genera hash de la contraseña que TÚ defines
    const hash = await bcrypt.hash(contraseña, 10);

    const [result]: any = await pool.query(
      'INSERT INTO usuario (nombre, correo, contraseña_hash, es_lider) VALUES (?, ?, ?, TRUE)',
      [nombre, correo, hash]
    );

    const liderId = result.insertId;

    // Asignar a departamentos
    if (Array.isArray(departamento_ids) && departamento_ids.length > 0) {
      const asignaciones = departamento_ids.map(id => [liderId, Number(id)]);
      await pool.query(
        'INSERT INTO usuario_departamento (usuario_id, departamento_id) VALUES ?',
        [asignaciones]
      );
    }

    res.status(201).json({
      id: liderId,
      nombre,
      correo
    });

  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Correo ya registrado' });
    }
    console.error('Error crearLider:', error);
    res.status(500).json({ error: 'Error al crear líder' });
  }
};

// --- ASIGNAR MIEMBRO A DEPARTAMENTO ---
export const asignarMiembroADepartamento = async (req: Request, res: Response) => {
  try {
    const { usuario_id, departamento_id } = req.body;
    if (!usuario_id || !departamento_id) {
      return res.status(400).json({ error: 'usuario_id y departamento_id requeridos' });
    }

    await pool.query(
      'INSERT INTO usuario_departamento (usuario_id, departamento_id) VALUES (?, ?)',
      [usuario_id, departamento_id]
    );

    res.status(201).json({ mensaje: 'Asignación creada' });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ya asignado a este departamento' });
    }
    res.status(500).json({ error: 'Error al asignar' });
  }
};

// --- MIEMBROS Y TAREAS POR DEPARTAMENTO (para líder) ---
export const obtenerMiembrosPorDepartamento = async (req: Request, res: Response) => {
  try {
    const { departamento_id } = req.query;
    if (!departamento_id) {
      return res.status(400).json({ error: 'departamento_id requerido' });
    }

    const [rows] = await pool.query(`
      SELECT u.id, u.nombre
      FROM usuario u
      INNER JOIN usuario_departamento ud ON u.id = ud.usuario_id
      WHERE ud.departamento_id = ? AND u.es_lider = FALSE
      ORDER BY u.nombre
    `, [departamento_id]);

    res.json(rows);
  } catch (error) {
    console.error('Error obtenerMiembrosPorDepartamento:', error);
    res.status(500).json({ error: 'Error al cargar miembros' });
  }
};

export const obtenerTareasPorDepartamento = async (req: Request, res: Response) => {
  try {
    const { departamento_id } = req.query;
    if (!departamento_id) {
      return res.status(400).json({ error: 'departamento_id requerido' });
    }

    const [rows] = await pool.query(`
      SELECT id, nombre
      FROM tarea
      WHERE departamento_id = ? AND activo = TRUE
      ORDER BY nombre
    `, [departamento_id]);

    res.json(rows);
  } catch (error) {
    console.error('Error obtenerTareasPorDepartamento:', error);
    res.status(500).json({ error: 'Error al cargar tareas' });
  }
};  
// --- CREAR TAREA ---
export const crearTarea = async (req: Request, res: Response) => {
  try {
    const { nombre, departamento_id } = req.body;

    if (!nombre || !departamento_id) {
      return res.status(400).json({ error: 'Nombre y departamento_id requeridos' });
    }

    const [result]: any = await pool.query(
      'INSERT INTO tarea (nombre, departamento_id) VALUES (?, ?)',
      [nombre.trim(), Number(departamento_id)]
    );

    res.status(201).json({
      id: result.insertId,
      nombre: nombre.trim(),
      departamento_id: Number(departamento_id)
    });

  } catch (error: any) {
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