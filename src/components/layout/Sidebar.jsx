import React from 'react';
import logoSvg from '../../assets/logo.svg';

export default function Sidebar({ activeTab, onSelectTab, currentUser, onLogout }) {
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
    { key: 'categories', label: 'Categories', icon: 'bi-folder-fill' },
    { key: 'news', label: 'News Articles', icon: 'bi-newspaper' },
    { key: 'users', label: 'User Accounts', icon: 'bi-people-fill' },
    { key: 'settings', label: 'Settings', icon: 'bi-gear-fill' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logoSvg} alt="FU News Logo" className="sidebar-logo" />
        <div>
          <h2 className="sidebar-title">FU News</h2>
          <p className="sidebar-subtitle">Management System</p>
        </div>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <li key={item.key} className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTab(item.key)}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        <div className="small text-secondary mb-2" style={{ fontSize: '0.75rem' }}>
          Signed in as <strong className="text-light">{currentUser?.username || 'Admin'}</strong>
        </div>
        <button
          type="button"
          className="btn btn-outline-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={onLogout}
        >
          <i className="bi bi-power"></i>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
