import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

export const login = async (req: Request, res: Response) => {
  console.log('🚀 Login (modo desarrollo: sin hash)');
  const { correo, contraseña } = req.body;

  try {
    // ✅ Solo para desarrollo: permitir 'lider123' como contraseña universal para líderes
    if (contraseña !== 'lider123') {
      return res.status(401).json({ error: 'Contraseña incorrecta (usa "lider123" en desarrollo)' });
    }

    const [rows]: any = await pool.query(
      'SELECT id, nombre, correo FROM usuario WHERE correo = ? AND es_lider = 1',
      [correo]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Líder no encontrado' });
    }

    const user = rows[0];
    const token = jwt.sign(
      { id: user.id, nombre: user.nombre },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    console.log('✅ Login exitoso para:', user.nombre);
    res.json({
      token,
      usuario: { id: user.id, nombre: user.nombre, correo: user.correo }
    });

  } catch (error) {
    console.error('💥 Error:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};