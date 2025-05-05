import { NextResponse } from 'next/server';
import pool from '@/app/config/database';
import { ClothingCategory } from '@/app/types/categories';

export async function GET() {
  try {
    const client = await pool.connect();
    
    try {
      // Set the search path
      await client.query('SET search_path TO capsulify_live');
      
      // First get all categories
      const categoriesResult = await client.query(`
        SELECT * FROM clothing_categories ORDER BY name
      `);
      
      // Then get all subcategories
      const subcategoriesResult = await client.query(`
        SELECT * FROM clothing_subcategories ORDER BY name
      `);
      
      // Get the relationships between categories and subcategories
      const relationshipsResult = await client.query(`
        SELECT DISTINCT clothing_category_id, clothing_subcategory_id 
        FROM clothing_categories_feature_groups 
        WHERE clothing_subcategory_id IS NOT NULL
      `);
      
      // Create a map of category IDs to their subcategories
      const categorySubcategoriesMap = new Map<number, any[]>();
      relationshipsResult.rows.forEach(row => {
        if (!categorySubcategoriesMap.has(row.clothing_category_id)) {
          categorySubcategoriesMap.set(row.clothing_category_id, []);
        }
        const subcategory = subcategoriesResult.rows.find(s => s.id === row.clothing_subcategory_id);
        if (subcategory) {
          categorySubcategoriesMap.get(row.clothing_category_id)?.push(subcategory);
        }
      });
      
      // Combine the data
      const categories = categoriesResult.rows.map(category => ({
        ...category,
        subcategories: categorySubcategoriesMap.get(category.id) || []
      }));
      
      return NextResponse.json(categories);
    } catch (error) {
      console.error('Error in categories GET:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch categories',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = await pool.connect();
    
    try {
      // Set the search path
      await client.query('SET search_path TO capsulify_live');
      
      const { name } = await request.json();
      const result = await client.query(
        'INSERT INTO clothing_categories (name) VALUES ($1) RETURNING *',
        [name]
      );
      return NextResponse.json(result.rows[0]);
    } catch (error) {
      console.error('Error in categories POST:', error);
      return NextResponse.json({ 
        error: 'Failed to create category',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
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
        'UPDATE clothing_categories SET name = $1 WHERE id = $2 RETURNING *',
        [name, id]
      );
      return NextResponse.json(result.rows[0]);
    } catch (error) {
      console.error('Error in categories PUT:', error);
      return NextResponse.json({ 
        error: 'Failed to update category',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const client = await pool.connect();
    
    try {
      // Set the search path
      await client.query('SET search_path TO capsulify_live');
      
      const { id } = await request.json();
      await client.query('DELETE FROM clothing_categories WHERE id = $1', [id]);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error in categories DELETE:', error);
      return NextResponse.json({ 
        error: 'Failed to delete category',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 