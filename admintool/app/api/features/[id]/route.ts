import { Pool } from 'pg';
import pool from '@/app/config/database';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();
  
  try {
    await client.query('SET search_path TO capsulify_live');
    
    const { name } = await request.json();
    const id = parseInt(params.id);
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const result = await client.query(
      'UPDATE clothing_features SET name = $1 WHERE id = $2 RETURNING id, name, clothing_feature_group_id',
      [name, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating feature:', error);
    return NextResponse.json({ error: 'Failed to update feature' }, { status: 500 });
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
    await client.query('SET search_path TO capsulify_live');
    
    const id = parseInt(params.id);

    // Check if the feature is used in any body shape features
    const checkResult = await client.query(
      'SELECT COUNT(*) as count FROM body_shapes_features WHERE clothing_feature_id = $1',
      [id]
    );

    if (checkResult.rows[0].count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete feature that is associated with body shapes' },
        { status: 400 }
      );
    }

    const result = await client.query(
      'DELETE FROM clothing_features WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Feature deleted successfully' });
  } catch (error) {
    console.error('Error deleting feature:', error);
    return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 });
  } finally {
    client.release();
  }
} 