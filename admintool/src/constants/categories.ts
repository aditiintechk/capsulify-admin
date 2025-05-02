export const CATEGORIES: { [key: number]: string } = {
  1: 'Tops',
  2: 'Bottoms',
  3: 'Dresses',
  4: 'Layers',
  5: 'Bags',
  6: 'Shoes'
};

export const getCategoryName = (id: number): string => {
  return CATEGORIES[id] || 'Unknown';
}; 