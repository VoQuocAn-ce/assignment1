import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import { newsService } from '../services/newsService';
import { userService } from '../services/userService';
import { ROLE } from '../services/mockData';

export default function DashboardPage({ onNavigate }) {
  const [categories, setCategories] = useState([]);
  const [news, setNews] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setCategories(categoryService.getAll());
    setNews(newsService.getAll());
    setUsers(userService.getAll());
  }, []);

  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.status === 1).length;

  const totalNews = news.length;
  const activeNews = news.filter(n => n.status === 1).length;
  const draftNews = totalNews - activeNews;

  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === ROLE.ADMIN).length;
  const staffUsers = totalUsers - adminUsers;

  // Category distribution
  const categoryStats = categories.map(cat => ({
    ...cat,
    count: news.filter(n => Number(n.categoryId) === cat.id).length
  }));

  const recentNews = news.slice(0, 5);

  const getCategoryName = (id) => {
    const found = categories.find(c => c.id === Number(id));
    return found ? found.name : 'Unknown';
  };

  return (
    <div>
      {/* Overview Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-blue">
              <i className="bi bi-folder2-open"></i>
            </div>
            <div>
              <div className="stat-value">{totalCategories}</div>
              <p className="stat-label">Categories ({activeCategories} Active)</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-green">
              <i className="bi bi-newspaper"></i>
            </div>
            <div>
              <div className="stat-value">{totalNews}</div>
              <p className="stat-label">News Articles ({activeNews} Published)</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-purple">
              <i className="bi bi-people"></i>
            </div>
            <div>
              <div className="stat-value">{totalUsers}</div>
              <p className="stat-label">Total Users ({staffUsers} Staff)</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-orange">
              <i className="bi bi-file-earmark-diff"></i>
            </div>
            <div>
              <div className="stat-value">{draftNews}</div>
              <p className="stat-label">Draft / Inactive News</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Recent News */}
        <div className="col-12 col-lg-8">
          <div className="custom-card">
            <div className="card-header-clean">
              <h3 className="card-title-clean">
                <i className="bi bi-clock-history me-2 text-primary"></i>
                Latest News Articles
              </h3>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => onNavigate('news')}
              >
                View All News &rarr;
              </button>
            </div>
            <div className="table-responsive">
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentNews.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-3">
                        No articles published yet.
                      </td>
                    </tr>
                  ) : (
                    recentNews.map(item => (
                      <tr key={item.id}>
                        <td className="fw-semibold text-truncate" style={{ maxWidth: '280px' }}>
                          {item.title}
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {getCategoryName(item.categoryId)}
                          </span>
                        </td>
                        <td className="small text-secondary">{item.createdBy}</td>
                        <td>
                          <span className={item.status === 1 ? 'badge-active' : 'badge-inactive'}>
                            <i className={`bi bi-${item.status === 1 ? 'check-circle-fill' : 'dash-circle'}`}></i>
                            {item.status === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="small text-muted">{item.createdAt || 'Recent'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Category Distribution & Quick Links */}
        <div className="col-12 col-lg-4">
          <div className="custom-card mb-4">
            <div className="card-header-clean">
              <h3 className="card-title-clean">
                <i className="bi bi-bar-chart-fill me-2 text-primary"></i>
                News by Category
              </h3>
            </div>
            <div className="p-3">
              {categoryStats.map(cat => {
                const percentage = totalNews > 0 ? Math.round((cat.count / totalNews) * 100) : 0;
                return (
                  <div key={cat.id} className="mb-3">
                    <div className="d-flex justify-content-between small fw-medium mb-1">
                      <span>{cat.name}</span>
                      <span className="text-muted">{cat.count} article(s) ({percentage}%)</span>
                    </div>
                    <div className="progress" style={{ height: '7px' }}>
                      <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{ width: `${percentage}%` }}
                        aria-valuenow={percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="custom-card">
            <div className="card-header-clean">
              <h3 className="card-title-clean">
                <i className="bi bi-lightning-charge-fill me-2 text-warning"></i>
                Quick Actions
              </h3>
            </div>
            <div className="p-3 d-grid gap-2">
              <button
                type="button"
                className="btn btn-outline-primary text-start d-flex align-items-center justify-content-between p-2"
                onClick={() => onNavigate('categories')}
              >
                <span><i className="bi bi-plus-circle me-2"></i>Manage Categories</span>
                <i className="bi bi-chevron-right small"></i>
              </button>
              <button
                type="button"
                className="btn btn-outline-primary text-start d-flex align-items-center justify-content-between p-2"
                onClick={() => onNavigate('news')}
              >
                <span><i className="bi bi-pencil-square me-2"></i>Publish New Article</span>
                <i className="bi bi-chevron-right small"></i>
              </button>
              <button
                type="button"
                className="btn btn-outline-primary text-start d-flex align-items-center justify-content-between p-2"
                onClick={() => onNavigate('users')}
              >
                <span><i className="bi bi-person-plus me-2"></i>Manage System Users</span>
                <i className="bi bi-chevron-right small"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
