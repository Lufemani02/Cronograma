"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cronogramas',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// Prueba inmediata al iniciar
pool.getConnection()
    .then(() => console.log('✅ Conexión a DB exitosa'))
    .catch(err => console.error('❌ Error de conexión:', err.message));
exports.default = pool;
//# sourceMappingURL=db.js.map