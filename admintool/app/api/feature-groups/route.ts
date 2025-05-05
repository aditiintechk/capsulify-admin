import { Pool } from 'pg';
import pool from '@/app/config/database';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await pool.connect();
  
  try {
    // Set the search path for this session
    await client.query('SET search_path TO capsulify_live');
    
    // Get all feature groups with their associated categories
    const result = await client.query(`
      SELECT 
        cfg.id,
        cfg.name,
        COALESCE(
          json_agg(
            json_build_object(
              'id', cc.id,
              'name', cc.name
            )
            ORDER BY cc.name
          ) FILTER (WHERE cc.id IS NOT NULL),
          '[]'
        ) as categories
      FROM clothing_feature_groups cfg
      LEFT JOIN clothing_categories_feature_groups ccfg ON cfg.id = ccfg.clothing_feature_group_id
      LEFT JOIN clothing_categories cc ON ccfg.clothing_category_id = cc.id
      GROUP BY cfg.id, cfg.name
      ORDER BY cfg.name
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching feature groups:', error);
    return NextResponse.json({ error: 'Failed to fetch feature groups' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    // Set the search path for this session
    await client.query('SET search_path TO capsulify_live');
    
    const { name, categoryIds } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Start a transaction
    await client.query('BEGIN');

    // Insert the feature group
    const result = await client.query(
      'INSERT INTO clothing_feature_groups (name) VALUES ($1) RETURNING id, name',
      [name]
    );

    const featureGroupId = result.rows[0].id;

    // Insert category associations if provided
    if (categoryIds && categoryIds.length > 0) {
      const values = categoryIds.map((categoryId: number) => `(${featureGroupId}, ${categoryId})`).join(',');
      await client.query(`
        INSERT INTO clothing_categories_feature_groups (clothing_feature_group_id, clothing_category_id)
        VALUES ${values}
      `);
    }

    // Commit the transaction
    await client.query('COMMIT');

    // Fetch the created feature group with its categories
    const createdGroup = await client.query(`
      SELECT 
        cfg.id,
        cfg.name,
        COALESCE(
          json_agg(
            json_build_object(
              'id', cc.id,
              'name', cc.name
            )
            ORDER BY cc.name
          ) FILTER (WHERE cc.id IS NOT NULL),
          '[]'
        ) as categories
      FROM clothing_feature_groups cfg
      LEFT JOIN clothing_categories_feature_groups ccfg ON cfg.id = ccfg.clothing_feature_group_id
      LEFT JOIN clothing_categories cc ON ccfg.clothing_category_id = cc.id
      WHERE cfg.id = $1
      GROUP BY cfg.id, cfg.name
    `, [featureGroupId]);

    return NextResponse.json(createdGroup.rows[0], { status: 201 });
  } catch (error) {
    // Rollback the transaction on error
    await client.query('ROLLBACK');
    console.error('Error creating feature group:', error);
    return NextResponse.json({ error: 'Failed to create feature group' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function PUT(request: Request) {
  const client = await pool.connect();
  
  try {
    // Set the search path for this session
    await client.query('SET search_path TO capsulify_live');
    
    const { id, name, categoryIds } = await request.json();
    
    if (!id || !name) {
      return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });
    }

    // Start a transaction
    await client.query('BEGIN');

    // Update the feature group name
    await client.query(
      'UPDATE clothing_feature_groups SET name = $1 WHERE id = $2',
      [name, id]
    );

    // Delete existing category associations
    await client.query(
      'DELETE FROM clothing_categories_feature_groups WHERE clothing_feature_group_id = $1',
      [id]
    );

    // Insert new category associations if provided
    if (categoryIds && categoryIds.length > 0) {
      const values = categoryIds.map((categoryId: number) => `(${id}, ${categoryId})`).join(',');
      await client.query(`
        INSERT INTO clothing_categories_feature_groups (clothing_feature_group_id, clothing_category_id)
        VALUES ${values}
      `);
    }

    // Commit the transaction
    await client.query('COMMIT');

    // Fetch the updated feature group with its categories
    const updatedGroup = await client.query(`
      SELECT 
        cfg.id,
        cfg.name,
        COALESCE(
          json_agg(
            json_build_object(
              'id', cc.id,
              'name', cc.name
            )
            ORDER BY cc.name
          ) FILTER (WHERE cc.id IS NOT NULL),
          '[]'
        ) as categories
      FROM clothing_feature_groups cfg
      LEFT JOIN clothing_categories_feature_groups ccfg ON cfg.id = ccfg.clothing_feature_group_id
      LEFT JOIN clothing_categories cc ON ccfg.clothing_category_id = cc.id
      WHERE cfg.id = $1
      GROUP BY cfg.id, cfg.name
    `, [id]);

    return NextResponse.json(updatedGroup.rows[0]);
  } catch (error) {
    // Rollback the transaction on error
    await client.query('ROLLBACK');
    console.error('Error updating feature group:', error);
    return NextResponse.json({ error: 'Failed to update feature group' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(request: Request) {
  const client = await pool.connect();
  
  try {
    // Set the search path for this session
    await client.query('SET search_path TO capsulify_live');
    
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Start a transaction
    await client.query('BEGIN');

    // Delete category associations first (due to foreign key constraint)
    await client.query(
      'DELETE FROM clothing_categories_feature_groups WHERE clothing_feature_group_id = $1',
      [id]
    );

    // Delete the feature group
    await client.query(
      'DELETE FROM clothing_feature_groups WHERE id = $1',
      [id]
    );

    // Commit the transaction
    await client.query('COMMIT');

    return NextResponse.json({ success: true });
  } catch (error) {
    // Rollback the transaction on error
    await client.query('ROLLBACK');
    console.error('Error deleting feature group:', error);
    return NextResponse.json({ error: 'Failed to delete feature group' }, { status: 500 });
  } finally {
    client.release();
  }
} 