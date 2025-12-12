import { Request, Response } from 'express';
import pool from '../config/db';

export const obtenerDepartamentosDelLider = async (req: Request, res: Response) => {
  try {
    const usuarioId = 1;; // viene del authMiddleware

    const [rows] = await pool.query(`
      SELECT d.id, d.nombre, d.descripcion
      FROM departamento d
      INNER JOIN usuario_departamento ud ON d.id = ud.departamento_id
      WHERE ud.usuario_id = ?
      ORDER BY d.nombre
    `, [usuarioId]);

    res.json(rows);
  } catch (error: any) {
  console.error('💥 ERROR REAL:', error.message);
  console.error('SQL:', error.sql);
  console.error('Stack:', error.stack);
  res.status(500).json({ error: error.message }); // ← para verlo en navegador
}
};