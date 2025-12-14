import { Request, Response } from 'express';
import pool from '../config/db';

export const asignarCronograma = async (req: Request, res: Response) => {
  try {
    const {
      departamento_id,
      usuario_id,
      tarea_id,
      fecha
    } = req.body;

    // Validación
    if (!departamento_id || !usuario_id || !tarea_id || !fecha) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verifica que el miembro pertenezca al departamento
    const [miembroRows]: any = await pool.query(
      `SELECT 1 FROM usuario_departamento 
       WHERE usuario_id = ? AND departamento_id = ?`,
      [usuario_id, departamento_id]
    );
    if (miembroRows.length === 0) {
      return res.status(400).json({ error: 'El miembro no pertenece a este ministerio' });
    }

    // Verifica que la tarea pertenezca al departamento
    const [tareaRows]: any = await pool.query(
      'SELECT 1 FROM tarea WHERE id = ? AND departamento_id = ?',
      [tarea_id, departamento_id]
    );
    if (tareaRows.length === 0) {
      return res.status(400).json({ error: 'La tarea no corresponde a este ministerio' });
    }

    // ✅ Validación de doble asignación: mismo miembro, misma fecha
    const [conflictoRows]: any = await pool.query(
      'SELECT 1 FROM cronograma WHERE usuario_id = ? AND fecha = ? AND estado != "cancelado"',
      [usuario_id, fecha]
    );
    if (conflictoRows.length > 0) {
      return res.status(409).json({ error: 'Este miembro ya está asignado el ' + fecha });
    }

    // Insertar asignación
    const [result]: any = await pool.query(
      `INSERT INTO cronograma 
       (departamento_id, usuario_id, tarea_id, fecha, creado_por, estado)
       VALUES (?, ?, ?, ?, ?, 'activo')`,
      [departamento_id, usuario_id, tarea_id, fecha, (req as any).usuarioId]
    );

    res.status(201).json({ id: result.insertId, mensaje: 'Asignación creada' });

  } catch (error: any) {
    console.error('Error asignarCronograma:', error);
    res.status(500).json({ error: 'Error al asignar servicio' });
  }
};
export const obtenerCronogramaDelMes = async (req: Request, res: Response) => {
  try {
    const { año, mes } = req.query; // ej: 2025, 12
    const usuarioId = (req as any).usuarioId;

    // Ensure mes and año are strings
    const mesStr = Array.isArray(mes) ? String(mes[0]) : String(mes || '');
    const añoStr = Array.isArray(año) ? String(año[0]) : String(año || '');

    const startDate = `${añoStr}-${mesStr.padStart(2, '0')}-01`;
    const endDate = new Date(Number(añoStr), Number(mesStr), 0).toISOString().split('T')[0];

    const [rows] = await pool.query(`
      SELECT 
        c.fecha,
        u.nombre AS miembro,
        t.nombre AS tarea,
        d.nombre AS ministerio
      FROM cronograma c
      JOIN usuario u ON c.usuario_id = u.id
      JOIN tarea t ON c.tarea_id = t.id
      JOIN departamento d ON c.departamento_id = d.id
      WHERE 
        c.fecha BETWEEN ? AND ? 
        AND d.id IN (
          SELECT departamento_id 
          FROM usuario_departamento 
          WHERE usuario_id = ?
        )
        AND c.estado = 'activo'
      ORDER BY c.fecha, d.nombre, t.nombre
    `, [startDate, endDate, usuarioId]);

    res.json(rows);
  } catch (error) {
    console.error('Error obtenerCronogramaDelMes:', error);
    res.status(500).json({ error: 'Error al cargar cronograma' });
  }
};