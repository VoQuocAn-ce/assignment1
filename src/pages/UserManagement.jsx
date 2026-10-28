import React, { useState, useEffect, useMemo } from 'react';
import { userService } from '../services/userService';
import { ROLE } from '../services/mockData';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import ToastAlert from '../components/common/ToastAlert';

// Võ Quốc An - CE10460
export default function UserManagement({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    role: ROLE.STAFF,
    status: 1
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Notification state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Load data
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(userService.getAll());
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Filtered displayed list based on search and filters (without mutating source data)
  const displayedUsers = useMemo(() => {
    return userService.search(users, searchKeyword, roleFilter, statusFilter);
  }, [users, searchKeyword, roleFilter, statusFilter]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedUser(null);
    setFormData({
      username: '',
      fullName: '',
      email: '',
      role: ROLE.STAFF,
      status: 1
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = 'Username is required.';
    }
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Invalid email format (e.g. user@fu.edu.vn).';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Form
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (modalMode === 'create') {
        const created = userService.create(formData);
        setUsers(prev => [...prev, created]);
        showToast(`User account "${created.username}" created successfully!`, 'success');
      } else {
        const updated = userService.update(selectedUser.id, formData);
        setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
        showToast(`User account "${updated.username}" updated successfully!`, 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message, 'danger');
    }
  };

  // Open Delete Confirmation
  const handleOpenDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    try {
      userService.delete(userToDelete.id, currentUser?.id);
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      showToast(`User account "${userToDelete.username}" deleted successfully!`, 'success');
      setIsDeleteOpen(false);
      setUserToDelete(null);
    } catch (err) {
      showToast(err.message, 'danger');
      setIsDeleteOpen(false);
    }
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchKeyword('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
  };

  return (
    <div>
      <ToastAlert
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="custom-card">
        <div className="card-header-clean">
          <div>
            <h3 className="card-title-clean">User & Account Management</h3>
            <p className="text-muted small m-0">Manage system administrators, staff members and user credentials</p>
          </div>
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={handleOpenCreate}
          >
            <i className="bi bi-person-plus-fill"></i>
            <span>Add User</span>
          </button>
        </div>

        <div className="p-3">
          {/* Toolbar: Search input + Role filter + Status filter */}
          <div className="row g-2 mb-3 align-items-center">
            <div className="col-12 col-md-5">
              <div className="search-input-wrapper w-100" style={{ maxWidth: '100%' }}>
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search users by username, full name, email..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                {searchKeyword && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearchKeyword('')}
                    title="Clear search"
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option value={ROLE.ADMIN}>Administrator</option>
                <option value={ROLE.STAFF}>Staff</option>
              </select>
            </div>

            <div className="col-6 col-md-2">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="1">Active Only</option>
                <option value="0">Inactive / Locked</option>
              </select>
            </div>

            <div className="col-12 col-md-2 text-md-end">
              {(searchKeyword || roleFilter !== 'ALL' || statusFilter !== 'ALL') && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm w-100"
                  onClick={handleClearFilters}
                >
                  <i className="bi bi-arrow-counterclockwise me-1"></i>Reset Filters
                </button>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-2 px-1">
            <span className="text-muted small">
              Showing <strong>{displayedUsers.length}</strong> of {users.length} accounts
            </span>
          </div>

          {/* Table or Empty State */}
          {displayedUsers.length === 0 ? (
            <EmptyState
              icon={searchKeyword || roleFilter !== 'ALL' || statusFilter !== 'ALL' ? 'bi-search' : 'bi-people'}
              title={searchKeyword || roleFilter !== 'ALL' ? 'No matching accounts' : 'No user accounts found'}
              description={
                searchKeyword || roleFilter !== 'ALL'
                  ? 'No user account matches your search query.'
                  : 'Start by clicking "Add User" above.'
              }
              actionLabel={searchKeyword || roleFilter !== 'ALL' ? 'Reset Filters' : 'Add First User'}
              onAction={searchKeyword || roleFilter !== 'ALL' ? handleClearFilters : handleOpenCreate}
            />
          ) : (
            <div className="table-responsive">
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>ID</th>
                    <th>Username</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th style={{ width: '130px' }}>Role</th>
                    <th style={{ width: '130px' }}>Status</th>
                    <th style={{ width: '110px' }} className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedUsers.map((item) => {
                    const isSelf = currentUser && Number(currentUser.id) === item.id;
                    const isAdmin = item.role === ROLE.ADMIN;

                    return (
                      <tr key={item.id}>
                        <td className="text-muted fw-bold">#{item.id}</td>
                        <td>
                          <div className="fw-semibold text-dark d-flex align-items-center gap-2">
                            <span>{item.username}</span>
                            {isSelf && (
                              <span className="badge bg-secondary-subtle text-secondary border" style={{ fontSize: '0.68rem' }}>
                                You
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="text-secondary">{item.fullName}</td>
                        <td className="small text-muted">{item.email}</td>
                        <td>
                          <span className={isAdmin ? 'badge-admin' : 'badge-staff'}>
                            {isAdmin ? 'Administrator' : 'Staff'}
                          </span>
                        </td>
                        <td>
                          <span className={item.status === 1 ? 'badge-active' : 'badge-inactive'}>
                            <i className={`bi bi-${item.status === 1 ? 'check-circle-fill' : 'lock-fill'}`}></i>
                            {item.status === 1 ? 'Active' : 'Locked'}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-1">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary btn-action"
                              title="Edit User"
                              onClick={() => handleOpenEdit(item)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className={`btn btn-sm btn-outline-danger btn-action ${isSelf ? 'opacity-50' : ''}`}
                              title={isSelf ? 'Cannot delete your own logged-in account' : 'Delete User'}
                              disabled={isSelf}
                              onClick={() => handleOpenDelete(item)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Popup Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        title={modalMode === 'create' ? 'Create New User Account' : `Edit User @${selectedUser?.username}`}
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary px-3"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary px-4"
              onClick={handleSubmitForm}
            >
              {modalMode === 'create' ? 'Create Account' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmitForm} noValidate>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">
              Username <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${formErrors.username ? 'is-invalid' : ''}`}
              placeholder="e.g. staff_nam"
              value={formData.username}
              disabled={modalMode === 'edit'}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                if (formErrors.username) setFormErrors({ ...formErrors, username: null });
              }}
              autoFocus={modalMode === 'create'}
            />
            {formErrors.username && (
              <div className="invalid-feedback">{formErrors.username}</div>
            )}
            {modalMode === 'edit' && (
              <div className="form-text small">Username cannot be changed after creation.</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">
              Full Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${formErrors.fullName ? 'is-invalid' : ''}`}
              placeholder="e.g. Nguyen Van Nam"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
                if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: null });
              }}
              autoFocus={modalMode === 'edit'}
            />
            {formErrors.fullName && (
              <div className="invalid-feedback">{formErrors.fullName}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">
              Email Address <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
              placeholder="e.g. namnv@fu.edu.vn"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (formErrors.email) setFormErrors({ ...formErrors, email: null });
              }}
            />
            {formErrors.email && (
              <div className="invalid-feedback">{formErrors.email}</div>
            )}
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">User Role</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: Number(e.target.value) })}
              >
                <option value={ROLE.STAFF}>Staff (Content Contributor)</option>
                <option value={ROLE.ADMIN}>Administrator (Full Access)</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Account Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
              >
                <option value={1}>Active (Unlocked)</option>
                <option value={0}>Locked (Access Disabled)</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete User Account"
        message="Are you sure you want to delete this user? The user will no longer be able to log in or author news."
        itemName={userToDelete ? `${userToDelete.fullName} (@${userToDelete.username})` : ''}
        confirmLabel="Confirm Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          setUserToDelete(null);
        }}
      />
    </div>
  );
}
