'use client';

import { useState } from 'react';
import styles from './page.module.css';
import CategoriesView from '../components/CategoriesView';
import FeatureGroupsView from '../components/FeatureGroupsView';
import FeaturesView from '../components/FeaturesView';
import BodyTypeFeaturesView from '../components/BodyTypeFeaturesView';

type TabType = 'categories' | 'features' | 'bodyTypeFeatures' | 'featureGroups';

export default function DataAdmin() {
  const [activeTab, setActiveTab] = useState<TabType>('categories');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'categories', label: 'Categories' },
    { id: 'featureGroups', label: 'Feature Groups' },
    { id: 'features', label: 'Features' },
    { id: 'bodyTypeFeatures', label: 'Body Type Features' },
  ];

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Data Admin</h1>
        
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'categories' && <CategoriesView />}
          {activeTab === 'features' && <FeaturesView />}  
          {activeTab === 'bodyTypeFeatures' && <BodyTypeFeaturesView />}
          {activeTab === 'featureGroups' && <FeatureGroupsView />}
        </div>
      </main>
    </div>
  );
}