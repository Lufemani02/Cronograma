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
const departamentoRoutes_1 = __importDefault(require("./routes/departamentoRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
// Rutas
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const usuarioRoutes_1 = __importDefault(require("./routes/usuarioRoutes"));
const cronogramaRoutes_1 = __importDefault(require("./routes/cronogramaRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const liderRoutes_1 = __importDefault(require("./routes/liderRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Ruta protegida: solo líderes
app.get('/api/lider/perfil', authMiddleware_1.authMiddleware, (req, res) => {
    res.json({ mensaje: '¡Acceso concedido!', usuarioId: req.body.usuarioId });
});
// Rutas
app.use('/api/auth', authRoutes_1.default);
app.use('/api/departamentos', departamentoRoutes_1.default);
app.use('/api/usuarios', usuarioRoutes_1.default);
app.use('/api/cronograma', cronogramaRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/lider', liderRoutes_1.default);
// Ruta de salud para verificar que el backend está vivo
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        time: new Date().toISOString()
    });
});
// Ruta raíz para Railway
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Backend IPUC ✅',
        time: new Date().toISOString()
    });
});
app.listen(PORT, () => {
    console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map