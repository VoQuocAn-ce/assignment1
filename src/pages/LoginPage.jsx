import React, { useState } from 'react';
import logoSvg from '../assets/logo.svg';
import { authService } from '../services/authService';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errs = {};
    if (!username.trim()) {
      errs.username = 'Username is required.';
    }
    if (!password.trim()) {
      errs.password = 'Password is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const result = authService.login(username, password);
    setIsSubmitting(false);

    if (result.success) {
      onLoginSuccess(result.user);
    } else {
      setAuthError(result.message);
    }
  };

  // Quick fill helper for teacher / demo convenience
  const handleQuickFill = (u, p) => {
    setUsername(u);
    setPassword(p);
    setErrors({});
    setAuthError('');
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <div className="text-center mb-4">
          <img src={logoSvg} alt="FU News Logo" className="login-logo" />
          <h2 className="fw-bold mb-1" style={{ fontSize: '1.5rem', color: '#0f172a' }}>
            FU News Management
          </h2>
          <p className="text-muted small">Sign in to manage news, categories & accounts</p>
        </div>

        {authError && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small rounded-3 mb-3" role="alert">
            <i className="bi bi-exclamation-octagon-fill fs-5"></i>
            <div>{authError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Username</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                placeholder="Enter username (e.g. Admin)"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors({ ...errors, username: null });
                }}
                autoFocus
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter password (e.g. Admin)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right"></i>
                <span>Sign In as Admin</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-top text-center">
          <p className="text-muted small mb-2">Rubric Quick-Test Credentials:</p>
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary py-1 px-2"
              style={{ fontSize: '0.75rem' }}
              onClick={() => handleQuickFill('Admin', 'Admin')}
            >
              Fill: <strong>Admin / Admin</strong>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary py-1 px-2"
              style={{ fontSize: '0.75rem' }}
              onClick={() => handleQuickFill('staff1', '123456')}
            >
              Fill: <strong>staff1 / 123456</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
