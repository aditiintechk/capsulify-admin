import { Pool } from 'pg';
import pool from '@/app/config/database';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await pool.connect();
  
  try {
    // Set the search path for this session
    await client.query('SET search_path TO capsulify_live');
    
    // Get all categories, including those with parent relationships
    const result = await client.query(`
      SELECT c.*, p.name as parent_name 
      FROM clothing_categories c
      LEFT JOIN clothing_categories p ON c.parent_id = p.id
      ORDER BY c.name
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    // Set the search path for this session
    await client.query('SET search_path TO capsulify_live');
    
    const { name, parent_id } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await client.query(
      'INSERT INTO clothing_categories (name, parent_id) VALUES ($1, $2)',
      [name, parent_id]
    );

    return NextResponse.json({ message: 'Category created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  } finally {
    client.release();
  }
} 