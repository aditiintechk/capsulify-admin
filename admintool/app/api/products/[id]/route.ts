// app/api/products/[id]/route.ts
import { getDBConnection } from '@/src/lib/db';
import type { ClothingItem } from '@/src/types/clothingitem';
import { RowDataPacket } from 'mysql2';
import { PoolConnection } from 'mysql2/promise';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  let db: PoolConnection | null = null;
  try {
    db = await getDBConnection();
  
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM products WHERE id = ?', [params.id]);
  
    if (rows.length === 0) {
      return new Response('Product not found', { status: 404 });
    }
  
    const product = rows[0] as ClothingItem;
    return Response.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return new Response('Internal Server Error', { status: 500 });
  } finally {
    if (db) {
      db.release();
    }
  }
}

export async function PUT(req: Request, { params }: { params: { id: number } }) {
  let db: PoolConnection | null = null;
  try {
    db = await getDBConnection();
    const { name, price } = await req.json();
    await db.execute('UPDATE clothing_items SET name = ?, price = ? WHERE id = ?', [name, price, params.id]);
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return new Response('Internal Server Error', { status: 500 });
  } finally {
    if (db) {
      db.release();
    }
  }
}

export async function DELETE(_: Request, { params }: { params: { id: number } }) {
  let db: PoolConnection | null = null;
  try {
    db = await getDBConnection();
    await db.execute('DELETE FROM clothing_items WHERE id = ?', [params.id]);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response('Internal Server Error', { status: 500 });
  } finally {
    if (db) {
      db.release();
    }
  }
}