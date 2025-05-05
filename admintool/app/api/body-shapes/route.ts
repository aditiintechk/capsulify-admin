import { Pool } from 'pg';
import pool from '@/app/config/database';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await pool.connect();
  
  try {
    await client.query('SET search_path TO capsulify_live');
    
    const result = await client.query(`
      SELECT id, name
      FROM body_shapes
      ORDER BY name
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching body shapes:', error);
    return NextResponse.json({ error: 'Failed to fetch body shapes' }, { status: 500 });
  } finally {
    client.release();
  }
} 