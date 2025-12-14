import mysql from 'mysql2/promise';

const pool = mysql.createPool({
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

export default pool;