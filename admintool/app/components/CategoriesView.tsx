'use client';

import { useState, useEffect } from 'react';
import styles from '../data-admin/page.module.css';
import { CategoryWithSubcategories } from '../types/categories';

export default function CategoriesView() {
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const response = await fetch('/api/categories');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        setError(errorData.error || 'Failed to fetch categories');
        setErrorDetails(errorData.details || null);
        return;
      }
      
      const data = await response.json();
      console.log('Categories data:', data);
      setCategories(data);
      setError(null);
      setErrorDetails(null);
    } catch (err) {
      console.error('Error in fetchCategories:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setErrorDetails(err instanceof Error ? err.stack || null : null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!response.ok) throw new Error('Failed to add category');
      
      setNewCategoryName('');
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category');
    }
  };

  const handleUpdateCategory = async (id: number) => {
    if (!editCategoryName.trim()) return;

    try {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: editCategoryName }),
      });

      if (!response.ok) throw new Error('Failed to update category');
      
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete category');
      
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>Error: {error}</div>
        {errorDetails && (
          <div className={styles.errorDetails}>
            <pre>{errorDetails}</pre>
          </div>
        )}
        <button onClick={fetchCategories} className={styles.button}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.categoriesContainer}>
      <div className={styles.addCategory}>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name"
          className={styles.input}
        />
        <button onClick={handleAddCategory} className={styles.button}>
          Add Category
        </button>
      </div>

      <div className={styles.categoriesList}>
        {categories.map((category) => (
          <div key={category.id} className={styles.categoryItem}>
            {editingCategory === category.id ? (
              <div className={styles.editForm}>
                <input
                  type="text"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  className={styles.input}
                />
                <button
                  onClick={() => handleUpdateCategory(category.id)}
                  className={styles.button}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCategory(null)}
                  className={styles.button}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className={styles.categoryContent}>
                <span className={styles.categoryName}>{category.name}</span>
                <div className={styles.categoryActions}>
                  <button
                    onClick={() => {
                      setEditingCategory(category.id);
                      setEditCategoryName(category.name);
                    }}
                    className={styles.button}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className={styles.button}
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