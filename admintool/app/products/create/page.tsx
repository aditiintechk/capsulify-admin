'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCategoryName, CATEGORIES } from '@/src/constants/categories';
import { BODYSHAPES } from '@/src/constants/bodyshapes';
import styles from './page.module.css';

export default function CreateProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: '',
    image_file_name: '',
    clothing_category_id: 1,
    body_shape_ids: [] as number[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formData.description,
          image_file_name: formData.image_file_name,
          clothing_category_id: formData.clothing_category_id,
          body_shape_ids: formData.body_shape_ids.join(',')
        }),
      });

      if (response.ok) {
        router.push('/products');
      } else {
        console.error('Failed to create product:', await response.text());
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'clothing_category_id' ? parseInt(value) : value
    }));
  };

  const handleBodyShapeChange = (bodyShapeId: number) => {
    setFormData(prev => ({
      ...prev,
      body_shape_ids: prev.body_shape_ids.includes(bodyShapeId)
        ? prev.body_shape_ids.filter(id => id !== bodyShapeId)
        : [...prev.body_shape_ids, bodyShapeId]
    }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Product</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Image Filename:</label>
          <input
            type="text"
            name="image_file_name"
            value={formData.image_file_name}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Category:</label>
          <select
            name="clothing_category_id"
            value={formData.clothing_category_id}
            onChange={handleChange}
            className={styles.select}
          >
            {Object.entries(CATEGORIES).map(([id, name]) => (
              <option key={id} value={Number(id)}>{name}</option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Body Types:</label>
          <button
            type="button"
            onClick={() => {
              const allBodyShapeIds = Object.keys(BODYSHAPES).map(Number);
              setFormData(prev => ({
                ...prev,
                body_shape_ids: prev.body_shape_ids.length === allBodyShapeIds.length
                  ? []
                  : allBodyShapeIds
              }));
            }}
            className={styles.selectAllButton}
          >
            {formData.body_shape_ids.length === Object.keys(BODYSHAPES).length
              ? 'Deselect All'
              : 'Select All'}
          </button>
          <div className={styles.bodyShapesContainer}>
            {Object.entries(BODYSHAPES).map(([id, name]) => (
              <label key={id} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.body_shape_ids.includes(Number(id))}
                  onChange={() => handleBodyShapeChange(Number(id))}
                  className={styles.checkbox}
                />
                {name}
              </label>
            ))}
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            onClick={() => router.push('/products')}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
}