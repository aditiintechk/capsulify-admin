import { NextResponse } from 'next/server';
import pool from '@/app/config/database';

export async function GET() {
  try {
    // Test database connection
    const client = await pool.connect();
    
    try {
      // Set the search path
      await client.query('SET search_path TO capsulify_live');
      
      // Check if tables exist
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'capsulify_live' 
        AND table_name IN ('clothing_categories', 'clothing_subcategories')
      `);
      
      return NextResponse.json({
        connection: 'success',
        schema: 'capsulify_live',
        tables: tablesResult.rows,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 