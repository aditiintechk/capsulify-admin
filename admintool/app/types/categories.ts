export interface ClothingCategory {
  id: number;
  parent_id: number | null;
  name: string;
  created_at: Date;
  updated_at: Date;
}