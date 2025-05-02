"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateClothingCombinations = void 0;
const db_1 = require("../db");
/**
 * Calculates the total number of clothing items and possible combinations for a user
 * @param userId - The ID of the user to calculate combinations for
 * @returns An object containing total clothing items and possible combinations
 */
async function calculateClothingCombinations(userId) {
    try {
        // Fetch user's clothing items with their categories
        const clothingItems = await db_1.db.query(`
      SELECT uci.*, ci.clothing_category_id
      FROM users_clothing_items uci
      JOIN clothing_items ci ON ci.id = uci.clothing_item_id
      WHERE user_id = ?
      ORDER BY ci.clothing_category_id;
    `, [userId]);
        // Calculate total clothing items
        const totalClothingItems = clothingItems.length;
        // Group items by category
        const itemsByCategory = clothingItems.reduce((acc, item) => {
            if (!acc[item.clothing_category_id]) {
                acc[item.clothing_category_id] = [];
            }
            acc[item.clothing_category_id].push(item);
            return acc;
        }, {});
        // Calculate total combinations
        const categoryArrays = Object.values(itemsByCategory);
        const totalCombinations = categoryArrays.reduce((total, categoryItems) => {
            return total * categoryItems.length;
        }, 1);
        return {
            totalClothingItems,
            totalCombinations
        };
    }
    catch (error) {
        console.error('Error calculating clothing combinations:', error);
        throw new Error('Failed to calculate clothing combinations');
    }
}
exports.calculateClothingCombinations = calculateClothingCombinations;
