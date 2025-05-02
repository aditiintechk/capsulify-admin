'use client';

import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

export default function CombinationsPage() {
  const [userId, setUserId] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<{ totalClothes: number; totalCombinations: number } | null>(null);

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(Number(e.target.value));
  };

  const handleRun = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      const response = await fetch(`/api/combinations?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch combinations');
      }
      const result = await response.json();
      
      setResults({
        totalClothes: result.TotalClothingItems,
        totalCombinations: result.TotalCombinations
      });
    } catch (error) {
      console.error('Error calculating combinations:', error);
      // You might want to add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Combinations Tester</h1>
        <div className={styles.formGroup}>
          <label htmlFor="userId" className={styles.label}>User ID:</label>
          <input
            type="number"
            id="userId"
            value={userId}
            onChange={handleUserIdChange}
            className={styles.input}
            min="1"
          />
        </div>
        <button 
          onClick={handleRun} 
          className={styles.runButton}
          disabled={isLoading}
        >
          Run
        </button>
        
        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {results && !isLoading && (
          <div className={styles.resultsContainer}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Total Clothes Items:</span>
              <span className={styles.resultValue}>{results.totalClothes}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Total Combinations:</span>
              <span className={styles.resultValue}>{results.totalCombinations}</span>
            </div>
          </div>
        )}

        <Link href="/" className={styles.productManagerButton}>
          Back to Home
        </Link>
      </main>
    </div>
  );
} 