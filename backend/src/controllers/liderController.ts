import { Request, Response } from 'express';
import pool from '../config/db';

export const obtenerDatosDelLider = async (req: Request, res: Response) => {
  try {
    // El token ya validó que req.body.usuarioId es válido
    const usuarioId = (req as any).usuarioId;
    console.log('👤 ID del líder autenticado:', usuarioId); // fallback para pruebas

    // 1. Obtener departamentos del líder
    const [deptosRows] = (await pool.query(`
      SELECT DISTINCT d.id, d.nombre, d.logo_url
      FROM departamento d
      INNER JOIN usuario_departamento ud ON d.id = ud.departamento_id
      WHERE ud.usuario_id = ?
      ORDER BY d.nombre
    `, [usuarioId])) as [any[], any];

    if (deptosRows.length === 0) {
      return res.json({ departamentos: [], miembros: [], tareas: [] });
    }

    const deptoIds = deptosRows.map((d: any) => d.id);

    // 2. Obtener miembros de esos departamentos
    const [miembrosRows] = await pool.query(`
      SELECT DISTINCT u.id, u.nombre, u.correo
      FROM usuario u
      INNER JOIN usuario_departamento ud ON u.id = ud.usuario_id
      WHERE ud.departamento_id IN (?) AND u.es_lider = FALSE
      ORDER BY u.nombre
    `, [deptoIds]);

    // 3. Obtener tareas de esos departamentos
    const [tareasRows] = await pool.query(`
      SELECT t.id, t.nombre, t.departamento_id, d.nombre AS departamento_nombre
      FROM tarea t
      INNER JOIN departamento d ON t.departamento_id = d.id
      WHERE t.departamento_id IN (?)
      ORDER BY d.nombre, t.nombre
    `, [deptoIds]);

    res.json({
      departamentos: deptosRows,
      miembros: miembrosRows,
      tareas: tareasRows
    });

  } catch (error) {
    console.error('Error en obtenerDatosDelLider:', error);
    res.status(500).json({ error: 'Error al cargar datos' });
  }
};
// Obtener miembros de un departamento específico
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

// Obtener tareas de un departamento específico
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