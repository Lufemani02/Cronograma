"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }
    const token = authHeader.split(' ')[1];
    console.log('🔐 Token recibido:', token.substring(0, 10) + '...');
    try {
        console.log('🔑 JWT_SECRET usado:', process.env.JWT_SECRET || '⚠️ undefined');
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token decodificado:', decoded);
        req.usuarioId = decoded.id; // ← usa req.usuarioId, no req.body
        next();
    }
    catch (error) {
        console.error('❌ JWT error:', error.message);
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map