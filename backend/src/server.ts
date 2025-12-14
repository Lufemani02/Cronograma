import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import departamentoRoutes from './routes/departamentoRoutes';
import adminRoutes from './routes/adminRoutes';

// Rutas
import authRoutes from './routes/authRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import cronogramaRoutes from './routes/cronogramaRoutes';
import { authMiddleware } from './middleware/authMiddleware';
import liderRoutes from './routes/liderRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Ruta protegida: solo líderes
app.get('/api/lider/perfil', authMiddleware, (req: any, res) => {
  res.json({ mensaje: '¡Acceso concedido!', usuarioId: req.body.usuarioId });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/departamentos', departamentoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/cronograma', cronogramaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lider', liderRoutes);

app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});