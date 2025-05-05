export interface ClothingCategory {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface ClothingSubcategory {
  id: number;
  category_id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface CategoryWithSubcategories extends ClothingCategory {
  subcategories: ClothingSubcategory[];
} 