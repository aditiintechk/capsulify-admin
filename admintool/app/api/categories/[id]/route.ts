import { Pool } from 'pg';
import pool from '@/app/config/database';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();
  
  try {
    const { name, parent_id } = await request.json();
    const id = parseInt(params.id);
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await client.query(
      'UPDATE clothing_categories SET name = $1, parent_id = $2 WHERE id = $3',
      [name, parent_id, id]
    );

    return NextResponse.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();
  
  try {
    const id = parseInt(params.id);

    // Check if the category has any child categories
    const result = await client.query(
      'SELECT COUNT(*) as count FROM clothing_categories WHERE parent_id = $1',
      [id]
    );

    if (result.rows[0].count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with child categories' },
        { status: 400 }
      );
    }

    await client.query('DELETE FROM clothing_categories WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  } finally {
    client.release();
  }
} 