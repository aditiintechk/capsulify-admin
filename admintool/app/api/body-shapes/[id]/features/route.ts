import { Pool } from 'pg';
import pool from '@/app/config/database';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();
  
  try {
    await client.query('SET search_path TO capsulify_live');
    
    // Ensure params is properly awaited
    const { id } = await Promise.resolve(params);
    const bodyShapeId = parseInt(id);
    
    const result = await client.query(`
      SELECT cf.id, cf.name, cf.clothing_feature_group_id
      FROM body_shapes_features bsf
      JOIN clothing_features cf ON bsf.clothing_feature_id = cf.id
      WHERE bsf.body_shape_id = $1
      ORDER BY cf.name
    `, [bodyShapeId]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching body shape features:', error);
    return NextResponse.json({ error: 'Failed to fetch body shape features' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();
  
  try {
    await client.query('SET search_path TO capsulify_live');
    
    // Ensure params is properly awaited
    const { id } = await Promise.resolve(params);
    const bodyShapeId = parseInt(id);
    const { featureIds } = await request.json();
    
    if (!Array.isArray(featureIds)) {
      return NextResponse.json({ error: 'Feature IDs must be an array' }, { status: 400 });
    }

    // Start transaction
    await client.query('BEGIN');

    // Delete existing features for this body shape
    await client.query(
      'DELETE FROM body_shapes_features WHERE body_shape_id = $1',
      [bodyShapeId]
    );

    // Insert new features
    if (featureIds.length > 0) {
      const values = featureIds.map((id, index) => `($${index * 2 + 1}, $${index * 2 + 2})`).join(',');
      const params = featureIds.flatMap(id => [bodyShapeId, id]);
      
      await client.query(
        `INSERT INTO body_shapes_features (body_shape_id, clothing_feature_id) VALUES ${values}`,
        params
      );
    }

    // Commit transaction
    await client.query('COMMIT');

    return NextResponse.json({ message: 'Features updated successfully' });
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error updating body shape features:', error);
    return NextResponse.json({ error: 'Failed to update body shape features' }, { status: 500 });
  } finally {
    client.release();
  }
} 