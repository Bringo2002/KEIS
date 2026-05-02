import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import styles from './Sidebar.module.css';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/players', label: 'Players', icon: '🏢' },
  { to: '/sectors', label: 'Sectors', icon: '📁' },
  { to: '/timeline', label: 'Timeline', icon: '📅' },
  { to: '/ai-search', label: 'AI Search', icon: '🤖' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={styles.toggleBtn}
      >
        {collapsed ? '✕' : '☰'}
      </button>

      <aside
        className={`${styles.aside} ${collapsed ? styles.asideOpen : ''}`}
      >
        <div className={styles.logoWrap}>
          <div className={styles.logoInner}>
            <div className={styles.logoIcon}>KE</div>
            <div>
              <h1 className={styles.logoTitle}>Kenya Economy</h1>
              <p className={styles.logoSub}>Intelligence System</p>
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setCollapsed(false)}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <div className={styles.footerText}>
            <p>Data sourced from CBK, NSE, KNBS</p>
            <p>Last updated: Jan 2025</p>
          </div>
        </div>
      </aside>
    </>
  );
}
