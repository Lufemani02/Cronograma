import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
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
      'INSERT INTO departamento (nombre, descripcion) VALUES (?, ?)',
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
    const { nombre, correo } = req.body;
    if (!nombre || !correo) return res.status(400).json({ error: 'Nombre y correo requeridos' });

    // Genera contraseña aleatoria (8 caracteres alfanuméricos)
    const contraseña = Math.random().toString(36).slice(-8);
    const hash = await bcrypt.hash(contraseña, 10);

    const [result]: any = await pool.query(
      'INSERT INTO usuario (nombre, correo, contraseña_hash, es_lider) VALUES (?, ?, ?, TRUE)',
      [nombre, correo, hash]
    );

    // 🔑 ¡Importante! Devuelve la contraseña **una sola vez**
    res.status(201).json({
      id: result.insertId,
      nombre,
      correo,
      contraseña_generada: contraseña, // ← Solo aquí
      es_lider: true
    });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Correo ya registrado' });
    }
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

// Crear tareas por departamento (opcional)
export const crearTarea = async (req: Request, res: Response) => {
  try {
    const { nombre, departamento_id } = req.body;
    if (!nombre || !departamento_id) {
      return res.status(400).json({ error: 'Nombre y departamento_id requeridos' });
    }

    const [result]: any = await pool.query(
      'INSERT INTO tarea (nombre, departamento_id) VALUES (?, ?)',
      [nombre, departamento_id]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      departamento_id
    });
  } catch (error: any) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Departamento no existe' });
    }
    res.status(500).json({ error: 'Error al crear tarea' });
  }
};