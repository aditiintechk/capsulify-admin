'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticate } from '../actions/auth';
import styles from './PasswordGate.module.css';

export default function PasswordGate() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await authenticate(password);
      if (result.success) {
        router.push('/');
      } else if (result.error) {
        setError(result.error);
        setIsLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Enter Password</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className={styles.input}
          disabled={isLoading}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button 
          type="submit" 
          className={styles.button}
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Submit'}
        </button>
      </form>
    </div>
  );
} 