const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTestUser() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('Inserting test user...');
    await pool.query(
      'INSERT INTO usuario (nombre, correo, telefono, es_lider) VALUES (?, ?, ?, ?)',
      ['Ana López', 'ana@ipuc.org', '123456789', true]
    );
    console.log('✅ Test user created successfully');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

createTestUser();
