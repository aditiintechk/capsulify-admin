// app/api/products/route.ts
import { getDBConnection } from '@/src/lib/db';
import { PoolConnection } from 'mysql2/promise';

export async function GET() {
  let db: PoolConnection | null = null;
  try {
    db = await getDBConnection();
    const [rows] = await db.query('SELECT * FROM clothing_items');
    return Response.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response('Internal Server Error', { status: 500 });
  } finally {
    if (db) {
      db.release();
    }
  }
}