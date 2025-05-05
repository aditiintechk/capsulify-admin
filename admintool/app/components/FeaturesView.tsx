'use client';

import { useState, useEffect } from 'react';
import styles from './FeaturesView.module.css';

interface Feature {
  id: number;
  name: string;
  clothing_feature_group_id: number;
}

interface Category {
  id: number;
  name: string;
}

interface FeatureGroup {
  id: number;
  name: string;
  categories: Category[];
}

export default function FeaturesView() {
  const [featureGroups, setFeatureGroups] = useState<FeatureGroup[]>([]);
  const [selectedFeatureGroup, setSelectedFeatureGroup] = useState<number | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeatureGroups();
  }, []);

  useEffect(() => {
    if (selectedFeatureGroup) {
      fetchFeatures();
    } else {
      setFeatures([]);
    }
  }, [selectedFeatureGroup]);

  const fetchFeatureGroups = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/feature-groups');
      if (!response.ok) throw new Error('Failed to fetch feature groups');
      const data = await response.json();
      setFeatureGroups(data);
    } catch (err) {
      setError('Failed to load feature groups');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeatures = async () => {
    if (!selectedFeatureGroup) return;
    try {
      const response = await fetch(`/api/features?featureGroupId=${selectedFeatureGroup}`);
      if (!response.ok) throw new Error('Failed to fetch features');
      const data = await response.json();
      setFeatures(data);
    } catch (err) {
      setError('Failed to load features');
      console.error(err);
    }
  };

  const handleCreateFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeatureGroup || !newFeatureName.trim()) return;

    try {
      const response = await fetch('/api/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFeatureName.trim(),
          clothing_feature_group_id: selectedFeatureGroup
        })
      });

      if (!response.ok) throw new Error('Failed to create feature');
      
      const newFeature = await response.json();
      setFeatures([...features, newFeature]);
      setNewFeatureName('');
    } catch (err) {
      setError('Failed to create feature');
      console.error(err);
    }
  };

  const handleUpdateFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeature) return;

    try {
      const response = await fetch(`/api/features/${editingFeature.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingFeature.name })
      });

      if (!response.ok) throw new Error('Failed to update feature');
      
      const updatedFeature = await response.json();
      setFeatures(features.map(f => f.id === updatedFeature.id ? updatedFeature : f));
      setEditingFeature(null);
    } catch (err) {
      setError('Failed to update feature');
      console.error(err);
    }
  };

  const handleDeleteFeature = async (id: number) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;

    try {
      const response = await fetch(`/api/features/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete feature');
      
      setFeatures(features.filter(f => f.id !== id));
    } catch (err) {
      setError('Failed to delete feature');
      console.error(err);
    }
  };

  const formatFeatureGroupLabel = (group: FeatureGroup) => {
    const categoryNames = group.categories.map(c => c.name).join(', ');
    return categoryNames 
      ? `${group.name} (${categoryNames})`
      : group.name;
  };

  return (
    <div className={styles.container}>
      <h2>Features Management</h2>
      
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.featureGroupSelect}>
        <label htmlFor="featureGroup">Select Feature Group:</label>
        <select
          id="featureGroup"
          value={selectedFeatureGroup || ''}
          onChange={(e) => setSelectedFeatureGroup(Number(e.target.value) || null)}
          disabled={isLoading}
        >
          <option value="">Select a feature group</option>
          {featureGroups.map(group => (
            <option key={group.id} value={group.id}>
              {formatFeatureGroupLabel(group)}
            </option>
          ))}
        </select>
      </div>

      {selectedFeatureGroup && (
        <>
          <form onSubmit={handleCreateFeature} className={styles.form}>
            <input
              type="text"
              value={newFeatureName}
              onChange={(e) => setNewFeatureName(e.target.value)}
              placeholder="New feature name"
              required
            />
            <button type="submit">Add Feature</button>
          </form>

          <div className={styles.featuresList}>
            {features.map(feature => (
              <div key={feature.id} className={styles.featureItem}>
                {editingFeature?.id === feature.id ? (
                  <form onSubmit={handleUpdateFeature} className={styles.editForm}>
                    <input
                      type="text"
                      value={editingFeature.name}
                      onChange={(e) => setEditingFeature({ ...editingFeature, name: e.target.value })}
                      required
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditingFeature(null)}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <span>{feature.name}</span>
                    <div className={styles.actions}>
                      <button onClick={() => setEditingFeature(feature)}>Edit</button>
                      <button onClick={() => handleDeleteFeature(feature.id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 