"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: ['https://cronogramaipuc.vercel.app'],
    credentials: true
}));
app.use(express_1.default.json());
// 
try {
    const authRoutes = require('./routes/authRoutes').default;
    app.use('/api/auth', authRoutes);
    console.log('✅ /api/auth montado');
}
catch (err) {
    console.error('❌ Error al cargar authRoutes:', err?.message || err);
}
try {
    const departamentoRoutes = require('./routes/departamentoRoutes').default;
    app.use('/api/departamentos', departamentoRoutes);
    console.log('✅ /api/departamentos montado');
}
catch (err) {
    console.error('❌ Error al cargar departamentoRoutes:', err?.message || err);
}
try {
    const usuarioRoutes = require('./routes/usuarioRoutes').default;
    app.use('/api/usuarios', usuarioRoutes);
    console.log('✅ /api/usuarios montado');
}
catch (err) {
    console.error('❌ Error al cargar usuarioRoutes:', err?.message || err);
}
try {
    const cronogramaRoutes = require('./routes/cronogramaRoutes').default;
    app.use('/api/cronograma', cronogramaRoutes);
    console.log('✅ /api/cronograma montado');
}
catch (err) {
    console.error('❌ Error al cargar cronogramaRoutes:', err?.message || err);
}
try {
    const adminRoutes = require('./routes/adminRoutes').default;
    app.use('/api/admin', adminRoutes);
    console.log('✅ /api/admin montado');
}
catch (err) {
    console.error('❌ Error al cargar adminRoutes:', err?.message || err);
}
try {
    const liderRoutes = require('./routes/liderRoutes').default;
    app.use('/api/lider', liderRoutes);
    console.log('✅ /api/lider montado');
}
catch (err) {
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
app.use((err, req, res, next) => {
    console.error('💥 Error no capturado:', err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});
app.listen(PORT, () => {
    console.log(`✅ Backend corriendo en puerto ${PORT}`);
    console.log(`🚀 Entorno: ${process.env.NODE_ENV || 'development'}`);
});
//# sourceMappingURL=server.js.map