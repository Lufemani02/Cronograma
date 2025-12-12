import { Request, Response } from 'express';
import pool from '../config/db';

export const obtenerUsuarios = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, nombre, correo, telefono, es_lider, activo 
      FROM usuario 
      ORDER BY nombre
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};
export const crearMiembro = async (req: Request, res: Response) => {
  try {
    const { nombre, correo, telefono } = req.body;

    // Validación básica
    if (!nombre || !correo) {
      return res.status(400).json({ error: 'Nombre y correo son requeridos' });
    }

    // Inserta como miembro (es_lider = false)
    const [result]: any = await pool.query(
      'INSERT INTO usuario (nombre, correo, telefono, es_lider) VALUES (?, ?, ?, FALSE)',
      [nombre, correo, telefono]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      correo,
      telefono,
      es_lider: false
    });
  } catch (error: any) {
    console.error('Error crearMiembro:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }
    res.status(500).json({ error: 'Error al crear miembro' });
  }
};