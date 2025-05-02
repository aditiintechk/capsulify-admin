import { getDBConnection } from '@/src/lib/db';
import { PoolConnection } from 'mysql2/promise';

// Types for our clothing data
interface ClothingItem {
  id: number;
  user_id: number;
  clothing_item_id: number;
  clothing_category_id: number;
}

interface CombinationResult {
  TotalClothingItems: number;
  TotalCombinations: number;
}

/**
 * Calculates the total number of clothing items and possible combinations for a user
 * @param userId - The ID of the user to calculate combinations for
 * @returns An object containing TotalClothingItems and TotalCombinations
 */
export async function calculateClothingCombinations(userId: number): Promise<CombinationResult> {
  let db: PoolConnection | null = null;
  
  try {
    db = await getDBConnection();
    
    // Query the database for user's clothing items
    const query = `
      SELECT uci.*, ci.clothing_category_id
      FROM users_clothing_items uci
      JOIN clothing_items ci ON ci.id = uci.clothing_item_id
      WHERE user_id = ?
      ORDER BY ci.clothing_category_id;
    `;

    const [rows] = await db.query(query, [userId]);
    const clothingItems = rows as ClothingItem[];

    // Calculate total clothing items
    const TotalClothingItems = clothingItems.length;

    // If there are no clothing items, return 0 combinations
    if (TotalClothingItems === 0) {
      return {
        TotalClothingItems: 0,
        TotalCombinations: 0
      };
    }

    // Group items by category
    const itemsByCategory = new Map<number, ClothingItem[]>();
    clothingItems.forEach(item => {
      const categoryItems = itemsByCategory.get(item.clothing_category_id) || [];
      categoryItems.push(item);
      itemsByCategory.set(item.clothing_category_id, categoryItems);
    });

    // Calculate total combinations
    let TotalCombinations = 1;
    for (const [_, items] of itemsByCategory) {
      TotalCombinations *= items.length;
    }

    return {
      TotalClothingItems,
      TotalCombinations
    };
  } catch (error) {
    console.error('Error calculating clothing combinations:', error);
    throw error;
  } finally {
    if (db) {
      db.release();
    }
  }
}
