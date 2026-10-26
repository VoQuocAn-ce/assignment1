import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout({ activeTab, onSelectTab, currentUser, onLogout, children }) {
  const getPageTitle = (tab) => {
    switch (tab) {
      case 'dashboard':
        return 'System Overview & Analytics';
      case 'categories':
        return 'Category Management';
      case 'news':
        return 'News Articles Management';
      case 'users':
        return 'User & Account Management';
      case 'settings':
        return 'System Settings & Profile';
      default:
        return 'Admin Portal';
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      <div className="main-wrapper">
        <Header
          pageTitle={getPageTitle(activeTab)}
          currentUser={currentUser}
          onLogout={onLogout}
        />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
}
