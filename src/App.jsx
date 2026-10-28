import React, { useState, useEffect } from 'react';
import { authService } from './services/authService';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import CategoryManagement from './pages/CategoryManagement';
import NewsManagement from './pages/NewsManagement';
import UserManagement from './pages/UserManagement';
import SettingsPage from './pages/SettingsPage';

// Võ Quốc An - CE10460
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Check persisted auth session on load
  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    setIsLoadingAuth(false);
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  if (isLoadingAuth) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading system...</span>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show LoginPage
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Render AdminLayout with active content
  return (
    <AdminLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      currentUser={currentUser}
      onLogout={handleLogout}
    >
      {activeTab === 'dashboard' && <DashboardPage onNavigate={setActiveTab} />}
      {activeTab === 'categories' && <CategoryManagement />}
      {activeTab === 'news' && <NewsManagement currentUser={currentUser} />}
      {activeTab === 'users' && <UserManagement currentUser={currentUser} />}
      {activeTab === 'settings' && <SettingsPage currentUser={currentUser} />}
    </AdminLayout>
  );
}
