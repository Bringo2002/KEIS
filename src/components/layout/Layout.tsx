import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import styles from './Layout.module.css';

export function Layout() {
  return (
    <div className={styles.root}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
