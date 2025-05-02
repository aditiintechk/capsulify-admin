import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.ctas}>
          <Link href="/products" className={`${styles.productManagerButton} ${styles.primary}`}>
            Product Manager
          </Link>
          <Link href="/combinations" className={`${styles.productManagerButton} ${styles.primary}`}>
            Combinations Tester
          </Link>
        </div>
      </main>
    </div>
  );
}
