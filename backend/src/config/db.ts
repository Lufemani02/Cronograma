/*import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;*/
import mysql from 'mysql2/promise';

console.log('🔌 Intentando conexión a DB...');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('DB:', process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'iglesia_cronogramas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Prueba inmediata al iniciar
pool.getConnection()
  .then(() => console.log('✅ Conexión a DB exitosa'))
  .catch(err => console.error('❌ Error de conexión:', err.message));

export default pool;