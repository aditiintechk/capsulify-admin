'use client';

import { useState, useEffect } from 'react';
import styles from './CategoriesView.module.css';

interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  parent_name: string | null;
}

export default function CategoriesView() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', parent_id: null as number | null });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      if (!response.ok) throw new Error('Failed to create category');
      setNewCategory({ name: '', parent_id: null });
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingCategory.name,
          parent_id: editingCategory.parent_id
        }),
      });
      if (!response.ok) throw new Error('Failed to update category');
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete category');
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getParentCategoryName = (category: Category) => {
    return category.parent_name || 'None';
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleCreateCategory} className={styles.form}>
        <h2>Create New Category</h2>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="parent_id">Parent Category:</label>
          <select
            id="parent_id"
            value={newCategory.parent_id || ''}
            onChange={(e) => setNewCategory({ 
              ...newCategory, 
              parent_id: e.target.value ? Number(e.target.value) : null 
            })}
          >
            <option value="">None</option>
            {categories
              .filter(category => category.parent_id === null)
              .map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <button type="submit" className={styles.button}>Create Category</button>
      </form>

      <div className={styles.categoriesList}>
        <h2>Categories</h2>
        {categories.map(category => (
          <div key={category.id} className={styles.categoryItem}>
            {editingCategory?.id === category.id ? (
              <form onSubmit={handleUpdateCategory} className={styles.form}>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <select
                    value={editingCategory.parent_id || ''}
                    onChange={(e) => setEditingCategory({ 
                      ...editingCategory, 
                      parent_id: e.target.value ? Number(e.target.value) : null 
                    })}
                  >
                    <option value="">None</option>
                    {categories
                      .filter(c => c.id !== category.id)
                      .map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.button}>Save</button>
                  <button 
                    type="button" 
                    onClick={() => setEditingCategory(null)}
                    className={styles.buttonSecondary}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.categoryContent}>
                <div>
                  <div className={styles.categoryName}>{category.name}</div>
                  <div className={styles.parentCategory}>
                    Parent: {getParentCategoryName(category)}
                  </div>
                </div>
                <div className={styles.actions}>
                  <button 
                    onClick={() => setEditingCategory(category)}
                    className={styles.buttonSecondary}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.id)}
                    className={styles.buttonDanger}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
