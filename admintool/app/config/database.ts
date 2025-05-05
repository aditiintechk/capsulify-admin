import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'db.chceiitswdiczdpkihvo.supabase.co',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'postgres',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '1qGygL29eeXkiGKRKKg6',
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  }
});

// Test the connection and set search path
pool.connect()
  .then(async client => {
    try {
      await client.query('SET search_path TO capsulify_live');
    } finally {
      client.release();
    }
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

export default pool; 