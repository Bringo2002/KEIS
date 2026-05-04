import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useEconomyStore } from '../../store/useEconomyStore';
import styles from './Layout.module.css';

export function Layout() {
  const { fetchInitialData, isLoading, error } = useEconomyStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <div className={styles.root}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.content}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'white' }}>
              <h2>Loading live data...</h2>
            </div>
          ) : error ? (
            <div style={{ padding: '2rem', color: 'red' }}>
              <h2>Error loading data</h2>
              <p>{error}</p>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
}
