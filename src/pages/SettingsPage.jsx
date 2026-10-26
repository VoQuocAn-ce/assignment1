import React, { useState } from 'react';
import { resetAllMockData } from '../services/mockData';
import ToastAlert from '../components/common/ToastAlert';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function SettingsPage({ currentUser }) {
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleResetData = () => {
    resetAllMockData();
    setIsResetConfirmOpen(false);
    setToast({
      message: 'Mock database has been restored to default seed data! Please refresh or navigate to see initial records.',
      type: 'success'
    });
  };

  return (
    <div>
      <ToastAlert
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="row g-4">
        {/* User Profile Card */}
        <div className="col-12 col-lg-6">
          <div className="custom-card">
            <div className="card-header-clean">
              <h3 className="card-title-clean">
                <i className="bi bi-person-circle me-2 text-primary"></i>
                Logged-in Profile
              </h3>
            </div>
            <div className="p-3">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="avatar-circle fs-4" style={{ width: '56px', height: '56px' }}>
                  {(currentUser?.username || 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h5 className="m-0 fw-bold">{currentUser?.fullName || 'System Administrator'}</h5>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <span className="badge-admin">Administrator</span>
                    <span className="text-muted small">@{currentUser?.username || 'Admin'}</span>
                  </div>
                </div>
              </div>

              <div className="list-group list-group-flush border-top border-bottom small mb-3">
                <div className="list-group-item d-flex justify-content-between px-0 py-2">
                  <span className="text-muted">Email Address</span>
                  <span className="fw-semibold">{currentUser?.email || 'admin@fu.edu.vn'}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between px-0 py-2">
                  <span className="text-muted">Current Role</span>
                  <span className="fw-semibold">Admin (Role ID: 1)</span>
                </div>
                <div className="list-group-item d-flex justify-content-between px-0 py-2">
                  <span className="text-muted">Session Login Time</span>
                  <span className="fw-semibold">
                    {currentUser?.loginAt ? new Date(currentUser.loginAt).toLocaleString() : 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Database & Mock Data Controls */}
        <div className="col-12 col-lg-6">
          <div className="custom-card mb-4">
            <div className="card-header-clean">
              <h3 className="card-title-clean">
                <i className="bi bi-database-fill-gear me-2 text-warning"></i>
                Mock Storage Management
              </h3>
            </div>
            <div className="p-3">
              <p className="text-muted small mb-3">
                All mock entities (Categories, News, Users) are stored in client-side <code>localStorage</code> to maintain data persistence across browser page reloads.
              </p>
              <div className="alert alert-warning small d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-info-circle-fill fs-5"></i>
                <div>
                  If you have added, edited, or deleted records during grading tests, you can reset all mock records back to the default factory state here.
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={() => setIsResetConfirmOpen(true)}
              >
                <i className="bi bi-arrow-counterclockwise"></i>
                <span>Reset All Mock Data to Default</span>
              </button>
            </div>
          </div>

          {/* Project Environment Info */}
          <div className="custom-card">
            <div className="card-header-clean">
              <h3 className="card-title-clean">
                <i className="bi bi-info-circle-fill me-2 text-primary"></i>
                Project Environment
              </h3>
            </div>
            <div className="p-3 small text-secondary">
              <div className="d-flex justify-content-between py-1 border-bottom">
                <span>Course</span>
                <span className="fw-semibold text-dark">SBA301 - Integrate SPA with Spring Boot</span>
              </div>
              <div className="d-flex justify-content-between py-1 border-bottom">
                <span>Assignment</span>
                <span className="fw-semibold text-dark">Assignment 01 - ReactJS Application</span>
              </div>
              <div className="d-flex justify-content-between py-1 border-bottom">
                <span>System</span>
                <span className="fw-semibold text-dark">FUNewsManagementSystem</span>
              </div>
              <div className="d-flex justify-content-between py-1 border-bottom">
                <span>Student / Class</span>
                <span className="fw-semibold text-dark">An Võ Quốc / SE1910</span>
              </div>
              <div className="d-flex justify-content-between py-1">
                <span>Tech Stack</span>
                <span className="fw-semibold text-dark">React 18 + Vite + Bootstrap 5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset All Mock Data"
        message="Are you sure you want to reset all Categories, News, and Users to initial mock state? Custom records created will be replaced."
        confirmLabel="Reset to Default"
        onConfirm={handleResetData}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}
