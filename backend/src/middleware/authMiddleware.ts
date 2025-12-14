import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🔐 Token recibido:', token.substring(0, 10) + '...');

    try {
    console.log('🔑 JWT_SECRET usado:', process.env.JWT_SECRET || '⚠️ undefined');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    console.log('✅ Token decodificado:', decoded);
    (req as any).usuarioId = decoded.id; // ← usa req.usuarioId, no req.body
    next();
  } catch (error: any) {
    console.error('❌ JWT error:', error.message);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};