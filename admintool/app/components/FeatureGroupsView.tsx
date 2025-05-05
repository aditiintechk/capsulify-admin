'use client';

import { useState, useEffect } from 'react';
import styles from './FeatureGroupsView.module.css';

interface Category {
  id: number;
  name: string;
}

interface FeatureGroup {
  id: number;
  name: string;
  categories: Category[];
}

export default function FeatureGroupsView() {
  const [featureGroups, setFeatureGroups] = useState<FeatureGroup[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newFeatureGroup, setNewFeatureGroup] = useState({ 
    name: '',
    categoryIds: [] as number[]
  });
  const [editingFeatureGroup, setEditingFeatureGroup] = useState<FeatureGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeatureGroups();
    fetchCategories();
  }, []);

  const fetchFeatureGroups = async () => {
    try {
      const response = await fetch('/api/feature-groups');
      if (!response.ok) throw new Error('Failed to fetch feature groups');
      const data = await response.json();
      setFeatureGroups(data);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    }
  };

  const handleCreateFeatureGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/feature-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFeatureGroup.name,
          categoryIds: newFeatureGroup.categoryIds
        }),
      });
      if (!response.ok) throw new Error('Failed to create feature group');
      setNewFeatureGroup({ name: '', categoryIds: [] });
      fetchFeatureGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleUpdateFeatureGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeatureGroup) return;
    try {
      const response = await fetch(`/api/feature-groups/${editingFeatureGroup.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingFeatureGroup.name,
          categoryIds: editingFeatureGroup.categories.map(c => c.id)
        }),
      });
      if (!response.ok) throw new Error('Failed to update feature group');
      setEditingFeatureGroup(null);
      fetchFeatureGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteFeatureGroup = async (id: number) => {
    try {
      const response = await fetch(`/api/feature-groups/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete feature group');
      fetchFeatureGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCategoryToggle = (categoryId: number, isCreating: boolean = true) => {
    if (isCreating) {
      setNewFeatureGroup(prev => ({
        ...prev,
        categoryIds: prev.categoryIds.includes(categoryId)
          ? prev.categoryIds.filter(id => id !== categoryId)
          : [...prev.categoryIds, categoryId]
      }));
    } else if (editingFeatureGroup) {
      setEditingFeatureGroup(prev => {
        if (!prev) return null;
        const categoryExists = prev.categories.some(c => c.id === categoryId);
        const updatedCategories = categoryExists
          ? prev.categories.filter(c => c.id !== categoryId)
          : [...prev.categories, categories.find(c => c.id === categoryId)!];
        return { ...prev, categories: updatedCategories };
      });
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleCreateFeatureGroup} className={styles.form}>
        <h2>Create New Feature Group</h2>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={newFeatureGroup.name}
            onChange={(e) => setNewFeatureGroup(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Associated Categories:</label>
          <div className={styles.categoryList}>
            {categories.map(category => (
              <label key={category.id} className={styles.categoryItem}>
                <input
                  type="checkbox"
                  checked={newFeatureGroup.categoryIds.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className={styles.button}>Create Feature Group</button>
      </form>

      <div className={styles.featureGroupsList}>
        <h2>Feature Groups</h2>
        {featureGroups.map(featureGroup => (
          <div key={featureGroup.id} className={styles.featureGroupItem}>
            {editingFeatureGroup?.id === featureGroup.id ? (
              <form onSubmit={handleUpdateFeatureGroup} className={styles.form}>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    value={editingFeatureGroup.name}
                    onChange={(e) => setEditingFeatureGroup(prev => 
                      prev ? { ...prev, name: e.target.value } : null
                    )}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Associated Categories:</label>
                  <div className={styles.categoryList}>
                    {categories.map(category => (
                      <label key={category.id} className={styles.categoryItem}>
                        <input
                          type="checkbox"
                          checked={editingFeatureGroup.categories.some(c => c.id === category.id)}
                          onChange={() => handleCategoryToggle(category.id, false)}
                        />
                        {category.name}
                      </label>
                    ))}
                  </div>
                </div>
                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.button}>Save</button>
                  <button 
                    type="button" 
                    onClick={() => setEditingFeatureGroup(null)}
                    className={styles.buttonSecondary}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.featureGroupContent}>
                <div className={styles.featureGroupName}>
                  {featureGroup.name}
                  {featureGroup.categories.length > 0 && (
                    <div className={styles.associatedCategories}>
                      ({featureGroup.categories.map(c => c.name).join(', ')})
                    </div>
                  )}
                </div>
                <div className={styles.actions}>
                  <button 
                    onClick={() => setEditingFeatureGroup(featureGroup)}
                    className={styles.buttonSecondary}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteFeatureGroup(featureGroup.id)}
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