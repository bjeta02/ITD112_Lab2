import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>Dashboard</div>
      <nav style={styles.nav}>
        <NavLink to="/dashboard" style={styles.navItem} activeStyle={styles.activeNavItem}>
          Dashboard
        </NavLink>
        <NavLink to="/add-dengue-data" style={styles.navItem} activeStyle={styles.activeNavItem}>
          Add Dengue Data
        </NavLink>
        <NavLink to="/dengue-data-list" style={styles.navItem} activeStyle={styles.activeNavItem}>
          Dengue Data List
        </NavLink>
      </nav>
    </div>
  );
};

// Inline styles
const styles = {
  sidebar: {
    width: '250px',
    height: '100vh',
    backgroundColor: '#343a40',
    color: '#fff',
    position: 'fixed',
    top: '0',
    left: '0',
    padding: '20px',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
  },
  navItem: {
    color: '#adb5bd',
    textDecoration: 'none',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '10px',
    transition: 'background-color 0.3s',
  },
  activeNavItem: {
    backgroundColor: '#495057',
    color: '#fff',
  },
};

export default Sidebar;
