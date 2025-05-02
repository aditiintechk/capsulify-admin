'use client';
import { useEffect, useState } from 'react';
import { ClothingItem } from '@/src/types/clothingitem';
import { getCategoryName } from '@/src/constants/categories';
import styles from './products.module.css';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: number) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Products</h1>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>ID</th>
              <th className={styles.tableHeader}>Description</th>
              <th className={styles.tableHeader}>Image Filename</th>
              <th className={styles.tableHeader}>Category</th>
              <th className={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: ClothingItem) => (
              <tr key={p.id}>
                <td className={styles.tableCell}>{p.id}</td>
                <td className={styles.tableCell}>{p.description}</td>
                <td className={styles.tableCell}>{p.image_file_name}</td>
                <td className={styles.tableCell}>{getCategoryName(p.clothing_category_id)}</td>
                <td className={styles.tableCell}>
                  <button onClick={() => deleteProduct(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className={styles.buttonContainer}>
        <button 
          onClick={() => router.push('/')}
          className={styles.primaryButton}
        >
          Back to Home
        </button>
        <button 
          onClick={() => router.push('/products/create')}
          className={styles.primaryButton}
        >
          Create Product
        </button>
      </div>
    </div>
  );
}
