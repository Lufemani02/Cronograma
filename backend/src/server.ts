import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: ['https://cronogramaipuc.vercel.app'], 
  credentials: true
}));
app.use(express.json());

// 
try {
  const authRoutes = require('./routes/authRoutes').default;
  app.use('/api/auth', authRoutes);
  console.log('✅ /api/auth montado');
} catch (err: any) {
  console.error('❌ Error al cargar authRoutes:', err?.message || err);
}

try {
  const departamentoRoutes = require('./routes/departamentoRoutes').default;
  app.use('/api/departamentos', departamentoRoutes);
  console.log('✅ /api/departamentos montado');
} catch (err: any) {
  console.error('❌ Error al cargar departamentoRoutes:', err?.message || err);
}

try {
  const usuarioRoutes = require('./routes/usuarioRoutes').default;
  app.use('/api/usuarios', usuarioRoutes);
  console.log('✅ /api/usuarios montado');
} catch (err: any) {
  console.error('❌ Error al cargar usuarioRoutes:', err?.message || err);
}

try {
  const cronogramaRoutes = require('./routes/cronogramaRoutes').default;
  app.use('/api/cronograma', cronogramaRoutes);
  console.log('✅ /api/cronograma montado');
} catch (err: any) {
  console.error('❌ Error al cargar cronogramaRoutes:', err?.message || err);
}

try {
  const adminRoutes = require('./routes/adminRoutes').default;
  app.use('/api/admin', adminRoutes);
  console.log('✅ /api/admin montado');
} catch (err: any) {
  console.error('❌ Error al cargar adminRoutes:', err?.message || err);
}

try {
  const liderRoutes = require('./routes/liderRoutes').default;
  app.use('/api/lider', liderRoutes);
  console.log('✅ /api/lider montado');
} catch (err: any) {
  console.error('❌ Error al cargar liderRoutes:', err?.message || err);
}

// Rutas de prueba
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    time: new Date().toISOString() 
  });
});

app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Backend IPUC ✅', 
    time: new Date().toISOString(),
    routes: [
      '/api/health',
      '/api/auth',
      '/api/departamentos',
      '/api/usuarios',
      '/api/cronograma',
      '/api/admin',
      '/api/lider'
    ]
  });
});

// Manejador final de errores (debug)
app.use((err: any, req: any, res: any, next: any) => {
  console.error('💥 Error no capturado:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en puerto ${PORT}`);
  console.log(`🚀 Entorno: ${process.env.NODE_ENV || 'development'}`);
});