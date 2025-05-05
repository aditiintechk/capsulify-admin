import { NextResponse } from 'next/server';
import pool from '@/app/config/database';
import { ClothingSubcategory } from '@/app/types/categories';

export async function GET(request: Request) {
  try {
    const client = await pool.connect();
    
    try {
      // Set the search path
      await client.query('SET search_path TO capsulify_live');
      
      const { searchParams } = new URL(request.url);
      const categoryId = searchParams.get('categoryId');
      
      let query = 'SELECT * FROM clothing_subcategories';
      const params = [];
      
      if (categoryId) {
        query += ' WHERE category_id = $1';
        params.push(categoryId);
      }
      
      query += ' ORDER BY name';
      
      const result = await client.query(query, params);
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json({ error: 'Failed to fetch subcategories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = await pool.connect();
    
    try {
      // Set the search path
      await client.query('SET search_path TO capsulify_live');
      
      const { category_id, name } = await request.json();
      const result = await client.query(
        'INSERT INTO clothing_subcategories (category_id, name) VALUES ($1, $2) RETURNING *',
        [category_id, name]
      );
      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating subcategory:', error);
    return NextResponse.json({ error: 'Failed to create subcategory' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const client = await pool.connect();
    
    try {
      // Set the search path
      await client.query('SET search_path TO capsulify_live');
      
      const { id, name } = await request.json();
      const result = await client.query(
        'UPDATE clothing_subcategories SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [name, id]
      );
      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating subcategory:', error);
    return NextResponse.json({ error: 'Failed to update subcategory' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const client = await pool.connect();
    
    try {
      // Set the search path
      await client.query('SET search_path TO capsulify_live');
      
      const { id } = await request.json();
      await client.query('DELETE FROM clothing_subcategories WHERE id = $1', [id]);
      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return NextResponse.json({ error: 'Failed to delete subcategory' }, { status: 500 });
  }
} 