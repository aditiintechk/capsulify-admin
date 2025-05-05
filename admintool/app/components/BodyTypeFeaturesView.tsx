'use client';

import { useState, useEffect } from 'react';
import styles from './BodyTypeFeaturesView.module.css';

interface BodyShape {
  id: number;
  name: string;
}

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

export default function BodyTypeFeaturesView() {
  const [bodyShapes, setBodyShapes] = useState<BodyShape[]>([]);
  const [selectedBodyShape, setSelectedBodyShape] = useState<number | null>(null);
  const [featureGroups, setFeatureGroups] = useState<FeatureGroup[]>([]);
  const [selectedFeatureGroup, setSelectedFeatureGroup] = useState<number | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [featuresLoading, setFeaturesLoading] = useState<boolean>(false);
  const [updatingFeatures, setUpdatingFeatures] = useState<Set<number>>(new Set());

  // Fetch body shapes
  useEffect(() => {
    const fetchBodyShapes = async () => {
      try {
        const response = await fetch('/api/body-shapes');
        if (!response.ok) throw new Error('Failed to fetch body shapes');
        const data = await response.json();
        setBodyShapes(data);
        if (data.length > 0) {
          setSelectedBodyShape(data[0].id);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load body shapes');
        setLoading(false);
        console.error(err);
      }
    };

    fetchBodyShapes();
  }, []);

  // Fetch feature groups
  useEffect(() => {
    const fetchFeatureGroups = async () => {
      try {
        const response = await fetch('/api/feature-groups');
        if (!response.ok) throw new Error('Failed to fetch feature groups');
        const data = await response.json();
        setFeatureGroups(data);
        if (data.length > 0) {
          setSelectedFeatureGroup(data[0].id);
        }
      } catch (err) {
        setError('Failed to load feature groups');
        console.error(err);
      }
    };

    fetchFeatureGroups();
  }, []);

  // Fetch features when feature group is selected
  useEffect(() => {
    const fetchFeatures = async () => {
      if (!selectedFeatureGroup) return;
      setFeaturesLoading(true);
      try {
        const response = await fetch(`/api/features?featureGroupId=${selectedFeatureGroup}`);
        if (!response.ok) throw new Error('Failed to fetch features');
        const data = await response.json();
        setFeatures(data);
      } catch (err) {
        setError('Failed to load features');
        console.error(err);
      } finally {
        setFeaturesLoading(false);
      }
    };

    fetchFeatures();
  }, [selectedFeatureGroup]);

  // Fetch selected features when body shape is selected
  useEffect(() => {
    const fetchSelectedFeatures = async () => {
      if (!selectedBodyShape) return;
      setFeaturesLoading(true);
      try {
        const response = await fetch(`/api/body-shapes/${selectedBodyShape}/features`);
        if (!response.ok) throw new Error('Failed to fetch selected features');
        const data = await response.json();
        setSelectedFeatures(data.map((f: Feature) => f.id));
      } catch (err) {
        setError('Failed to load selected features');
        console.error(err);
      } finally {
        setFeaturesLoading(false);
      }
    };

    fetchSelectedFeatures();
  }, [selectedBodyShape]);

  const handleFeatureToggle = async (featureId: number) => {
    if (!selectedBodyShape) return;

    const isSelected = selectedFeatures.includes(featureId);
    const newSelectedFeatures = isSelected
      ? selectedFeatures.filter(id => id !== featureId)
      : [...selectedFeatures, featureId];

    // Add feature to updating set
    setUpdatingFeatures(prev => new Set(prev).add(featureId));

    try {
      const response = await fetch(`/api/body-shapes/${selectedBodyShape}/features`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featureIds: newSelectedFeatures }),
      });

      if (!response.ok) throw new Error('Failed to update features');
      setSelectedFeatures(newSelectedFeatures);
    } catch (err) {
      setError('Failed to update features');
      console.error(err);
    } finally {
      // Remove feature from updating set
      setUpdatingFeatures(prev => {
        const newSet = new Set(prev);
        newSet.delete(featureId);
        return newSet;
      });
    }
  };

  const formatFeatureGroupLabel = (group: FeatureGroup) => {
    const categoryNames = group.categories.map(c => c.name).join(', ');
    return categoryNames 
      ? `${group.name} (${categoryNames})`
      : group.name;
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2>Select Body Shape</h2>
        <select
          value={selectedBodyShape || ''}
          onChange={(e) => setSelectedBodyShape(Number(e.target.value))}
          className={styles.select}
          disabled={featuresLoading}
        >
          {bodyShapes.map((shape) => (
            <option key={shape.id} value={shape.id}>
              {shape.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.section}>
        <h2>Select Feature Group</h2>
        <select
          value={selectedFeatureGroup || ''}
          onChange={(e) => setSelectedFeatureGroup(Number(e.target.value))}
          className={styles.select}
          disabled={featuresLoading}
        >
          {featureGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {formatFeatureGroupLabel(group)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.section}>
        <h2>Available Features</h2>
        <div className={`${styles.featuresList} ${featuresLoading ? styles.loading : ''}`}>
          {featuresLoading && <div className={styles.spinner} />}
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className={`${styles.featureItem} ${updatingFeatures.has(feature.id) ? styles.updating : ''}`}
            >
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(feature.id)}
                  onChange={() => handleFeatureToggle(feature.id)}
                  className={styles.checkbox}
                  disabled={featuresLoading || updatingFeatures.has(feature.id)}
                />
                {feature.name}
                {updatingFeatures.has(feature.id) && <div className={styles.itemSpinner} />}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 