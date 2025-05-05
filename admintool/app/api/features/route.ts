import { Pool } from 'pg';
import pool from '@/app/config/database';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const client = await pool.connect();
  
  try {
    await client.query('SET search_path TO capsulify_live');
    
    const { searchParams } = new URL(request.url);
    const featureGroupId = searchParams.get('featureGroupId');
    
    if (!featureGroupId) {
      return NextResponse.json({ error: 'Feature group ID is required' }, { status: 400 });
    }

    const result = await client.query(`
      SELECT id, name, clothing_feature_group_id
      FROM clothing_features
      WHERE clothing_feature_group_id = $1
      ORDER BY name
    `, [featureGroupId]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    await client.query('SET search_path TO capsulify_live');
    
    const { name, clothing_feature_group_id } = await request.json();
    
    if (!name || !clothing_feature_group_id) {
      return NextResponse.json({ error: 'Name and feature group ID are required' }, { status: 400 });
    }

    const result = await client.query(
      'INSERT INTO clothing_features (name, clothing_feature_group_id) VALUES ($1, $2) RETURNING id, name, clothing_feature_group_id',
      [name, clothing_feature_group_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 });
  } finally {
    client.release();
  }
} 