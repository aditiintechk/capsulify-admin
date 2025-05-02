// lib/db.ts
import mysql, { Pool, PoolConnection } from 'mysql2/promise';

let pool: Pool | null = null;

/**
 * Initializes and returns a MySQL connection pool.
 * Ensures a single pool instance is used throughout the app.
 */
function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'capsulify',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

/**
 * Gets a connection from the MySQL pool.
 * Remember to release the connection after use.
 */
export async function getDBConnection(): Promise<PoolConnection> {
  const pool = getPool();
  return await pool.getConnection();
}