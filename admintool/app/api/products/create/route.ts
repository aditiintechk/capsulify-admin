import { getDBConnection } from '@/src/lib/db';
import { PoolConnection } from 'mysql2/promise';

export async function POST(req: Request) {
    let db: PoolConnection | null = null;
    
    try {
        const { description, image_file_name, clothing_category_id, body_shape_ids } = await req.json();

        db = await getDBConnection();

        // Start transaction
        await db.beginTransaction();

        // Insert into clothing_items
        const [result] = await db.execute(
            'INSERT INTO clothing_items (description, image_file_name, clothing_category_id) VALUES (?, ?, ?)',
            [description, image_file_name, clothing_category_id]
        );

        // Get the inserted clothing item ID
        const clothingItemId = (result as any).insertId;

        // Insert into clothing_item_body_shapes for each body shape
        if (body_shape_ids && body_shape_ids.length > 0) {
            const bodyShapeIds = body_shape_ids.split(',').map((id: string) => parseInt(id));
            for (const bodyShapeId of bodyShapeIds) {
                await db.execute(
                    'INSERT INTO clothing_item_body_shapes (clothing_item_id, body_shape_id) VALUES (?, ?)',
                    [clothingItemId, bodyShapeId]
                );
            }
        }

        // Commit transaction
        await db.commit();
        return new Response(null, { status: 201 });
    } catch (error) {
        // Rollback transaction on error
        if (db) {
            await db.rollback();
        }
        console.error('Error creating product:', error);
        return new Response('Error creating product', { status: 500 });
    } finally {
        if (db) {
            db.release();
        }
    }
}