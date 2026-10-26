import React, { useState, useEffect, useMemo } from 'react';
import { newsService } from '../services/newsService';
import { categoryService } from '../services/categoryService';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import ToastAlert from '../components/common/ToastAlert';

export default function NewsManagement({ currentUser }) {
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Filter & Search states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedNews, setSelectedNews] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    createdBy: '',
    status: 1,
    tags: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  // Notification state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setNewsList(newsService.getAll());
    setCategories(categoryService.getAll());
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Helper to get category name by ID
  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === Number(catId));
    return cat ? cat.name : 'Unknown';
  };

  // Filtered displayed list based on search and filters (without mutating source data)
  const displayedNews = useMemo(() => {
    return newsService.search(newsList, searchKeyword, categoryFilter, statusFilter);
  }, [newsList, searchKeyword, categoryFilter, statusFilter]);

  // Open Create Modal
  const handleOpenCreate = () => {
    const defaultCatId = categories.length > 0 ? categories[0].id : '';
    setModalMode('create');
    setSelectedNews(null);
    setFormData({
      title: '',
      content: '',
      categoryId: defaultCatId,
      createdBy: currentUser?.username || 'Admin',
      status: 1,
      tags: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setModalMode('edit');
    setSelectedNews(item);
    setFormData({
      title: item.title,
      content: item.content,
      categoryId: item.categoryId,
      createdBy: item.createdBy,
      status: item.status,
      tags: item.tags || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'News title cannot be empty.';
    }
    if (!formData.content.trim()) {
      errors.content = 'News content cannot be empty.';
    }
    if (!formData.categoryId) {
      errors.categoryId = 'Please select a category.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Create or Edit Form
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (modalMode === 'create') {
        const created = newsService.create({
          ...formData,
          createdBy: currentUser?.username || formData.createdBy || 'Admin'
        });
        setNewsList(prev => [created, ...prev]);
        showToast(`Article "${created.title}" published successfully!`, 'success');
      } else {
        const updated = newsService.update(selectedNews.id, formData);
        setNewsList(prev => prev.map(n => n.id === updated.id ? updated : n));
        showToast(`Article "${updated.title}" updated successfully!`, 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message, 'danger');
    }
  };

  // Open Delete Confirmation
  const handleOpenDelete = (item) => {
    setNewsToDelete(item);
    setIsDeleteOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!newsToDelete) return;
    try {
      newsService.delete(newsToDelete.id);
      setNewsList(prev => prev.filter(n => n.id !== newsToDelete.id));
      showToast(`Article "${newsToDelete.title}" deleted successfully!`, 'success');
      setIsDeleteOpen(false);
      setNewsToDelete(null);
    } catch (err) {
      showToast(err.message, 'danger');
      setIsDeleteOpen(false);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchKeyword('');
    setCategoryFilter('ALL');
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
            <h3 className="card-title-clean">News Articles Management</h3>
            <p className="text-muted small m-0">Create, edit, search and organize campus news articles</p>
          </div>
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={handleOpenCreate}
          >
            <i className="bi bi-pencil-square"></i>
            <span>Publish Article</span>
          </button>
        </div>

        <div className="p-3">
          {/* Toolbar: Search input + Category filter + Status filter */}
          <div className="row g-2 mb-3 align-items-center">
            <div className="col-12 col-md-5">
              <div className="search-input-wrapper w-100" style={{ maxWidth: '100%' }}>
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search articles by title, content, author, tags..."
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
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
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
                <option value="0">Drafts Only</option>
              </select>
            </div>

            <div className="col-12 col-md-2 text-md-end">
              {(searchKeyword || categoryFilter !== 'ALL' || statusFilter !== 'ALL') && (
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
              Showing <strong>{displayedNews.length}</strong> of {newsList.length} articles
            </span>
          </div>

          {/* Table or Empty State */}
          {displayedNews.length === 0 ? (
            <EmptyState
              icon={searchKeyword || categoryFilter !== 'ALL' || statusFilter !== 'ALL' ? 'bi-search' : 'bi-newspaper'}
              title={searchKeyword || categoryFilter !== 'ALL' ? 'No matching news articles' : 'No news articles found'}
              description={
                searchKeyword || categoryFilter !== 'ALL'
                  ? 'No news articles match your filter criteria.'
                  : 'Start by clicking "Publish Article" above to create the first news item.'
              }
              actionLabel={searchKeyword || categoryFilter !== 'ALL' ? 'Reset Filters' : 'Publish First Article'}
              onAction={searchKeyword || categoryFilter !== 'ALL' ? handleClearFilters : handleOpenCreate}
            />
          ) : (
            <div className="table-responsive">
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>ID</th>
                    <th style={{ minWidth: '220px' }}>Title & Content Preview</th>
                    <th style={{ width: '150px' }}>Category</th>
                    <th style={{ width: '110px' }}>Author</th>
                    <th style={{ width: '130px' }}>Status</th>
                    <th style={{ width: '110px' }}>Date</th>
                    <th style={{ width: '110px' }} className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedNews.map((item) => (
                    <tr key={item.id}>
                      <td className="text-muted fw-bold">#{item.id}</td>
                      <td>
                        <div className="fw-semibold text-dark mb-1">{item.title}</div>
                        <div className="text-muted small text-truncate" style={{ maxWidth: '380px' }}>
                          {item.content}
                        </div>
                        {item.tags && (
                          <div className="mt-1">
                            {item.tags.split(',').map((t, idx) => (
                              <span key={idx} className="badge bg-light text-secondary border me-1" style={{ fontSize: '0.7rem' }}>
                                #{t.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                          {getCategoryName(item.categoryId)}
                        </span>
                      </td>
                      <td className="small text-secondary fw-medium">{item.createdBy}</td>
                      <td>
                        <span className={item.status === 1 ? 'badge-active' : 'badge-inactive'}>
                          <i className={`bi bi-${item.status === 1 ? 'check-circle-fill' : 'dash-circle'}`}></i>
                          {item.status === 1 ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="small text-muted">{item.createdAt || 'N/A'}</td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary btn-action"
                            title="Edit Article"
                            onClick={() => handleOpenEdit(item)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger btn-action"
                            title="Delete Article"
                            onClick={() => handleOpenDelete(item)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Popup Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        title={modalMode === 'create' ? 'Publish New Article' : `Edit Article #${selectedNews?.id}`}
        onClose={() => setIsModalOpen(false)}
        maxWidth="640px"
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
              {modalMode === 'create' ? 'Publish Article' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmitForm} noValidate>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">
              Article Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
              placeholder="e.g. FPT University Announces Hackathon 2026"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (formErrors.title) setFormErrors({ ...formErrors, title: null });
              }}
              autoFocus
            />
            {formErrors.title && (
              <div className="invalid-feedback">{formErrors.title}</div>
            )}
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">
                Category <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${formErrors.categoryId ? 'is-invalid' : ''}`}
                value={formData.categoryId}
                onChange={(e) => {
                  setFormData({ ...formData, categoryId: Number(e.target.value) });
                  if (formErrors.categoryId) setFormErrors({ ...formErrors, categoryId: null });
                }}
              >
                <option value="">-- Choose Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.status === 0 ? '(Inactive)' : ''}
                  </option>
                ))}
              </select>
              {formErrors.categoryId && (
                <div className="invalid-feedback">{formErrors.categoryId}</div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Publication Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
              >
                <option value={1}>Active (Published)</option>
                <option value={0}>Draft (Inactive)</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">
              Article Content <span className="text-danger">*</span>
            </label>
            <textarea
              className={`form-control ${formErrors.content ? 'is-invalid' : ''}`}
              rows="5"
              placeholder="Full article body content..."
              value={formData.content}
              onChange={(e) => {
                setFormData({ ...formData, content: e.target.value });
                if (formErrors.content) setFormErrors({ ...formErrors, content: null });
              }}
            />
            {formErrors.content && (
              <div className="invalid-feedback">{formErrors.content}</div>
            )}
          </div>

          <div className="row g-3 mb-2">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Tags (Comma-separated)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. AI, University, Workshop"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Author</label>
              <input
                type="text"
                className="form-control"
                value={formData.createdBy || currentUser?.username || 'Admin'}
                readOnly
                style={{ backgroundColor: '#f8fafc' }}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Article"
        message="Are you sure you want to permanently delete this news article?"
        itemName={newsToDelete ? `${newsToDelete.title} (ID: #${newsToDelete.id})` : ''}
        confirmLabel="Confirm Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          setNewsToDelete(null);
        }}
      />
    </div>
  );
}
