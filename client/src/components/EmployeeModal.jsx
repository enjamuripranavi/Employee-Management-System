import React, { useState, useEffect, useRef } from 'react';

const COMMON_DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Product',
  'Operations',
  'Design',
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmployeeModal({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false, serverError = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
  });

  const [errors, setErrors] = useState({});
  const [customDept, setCustomDept] = useState(false);
  const nameInputRef = useRef(null);

  // Initialize or reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const isStandardDept = COMMON_DEPARTMENTS.includes(initialData.department);
        setFormData({
          name: initialData.name || '',
          email: initialData.email || '',
          department: initialData.department || '',
          designation: initialData.designation || '',
        });
        setCustomDept(!isStandardDept && Boolean(initialData.department));
      } else {
        setFormData({
          name: '',
          email: '',
          department: '',
          designation: '',
        });
        setCustomDept(false);
      }
      setErrors({});

      // Auto-focus first input
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, initialData]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g., name@company.com)';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    } else if (formData.designation.trim().length < 2) {
      newErrors.designation = 'Designation must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDeptSelect = (e) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setCustomDept(true);
      setFormData((prev) => ({ ...prev, department: '' }));
    } else {
      setCustomDept(false);
      setFormData((prev) => ({ ...prev, department: val }));
    }
    if (errors.department) {
      setErrors((prev) => ({ ...prev, department: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      department: formData.department.trim(),
      designation: formData.designation.trim(),
    });
  };

  const isEditing = Boolean(initialData);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-dialog">
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {isEditing ? 'Edit Employee Details' : 'Add New Employee'}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {/* Server Error Alert */}
            {serverError && (
              <div className="form-general-error" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{serverError}</span>
              </div>
            )}

            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="emp-name" className="form-label">
                Full Name <span className="required-star">*</span>
              </label>
              <input
                ref={nameInputRef}
                id="emp-name"
                name="name"
                type="text"
                placeholder="e.g. John Doe"
                className={`form-control ${errors.name ? 'has-error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="name"
              />
              {errors.name && (
                <div className="form-error-msg">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label htmlFor="emp-email" className="form-label">
                Email Address <span className="required-star">*</span>
              </label>
              <input
                id="emp-email"
                name="email"
                type="email"
                placeholder="e.g. john.doe@company.com"
                className={`form-control ${errors.email ? 'has-error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="email"
              />
              {errors.email && (
                <div className="form-error-msg">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Department */}
            <div className="form-group">
              <label htmlFor="emp-dept" className="form-label">
                Department <span className="required-star">*</span>
              </label>
              {!customDept ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    id="emp-dept"
                    className={`form-control ${errors.department ? 'has-error' : ''}`}
                    value={formData.department}
                    onChange={handleDeptSelect}
                    disabled={isSubmitting}
                  >
                    <option value="">Select a department...</option>
                    {COMMON_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                    <option value="__custom__">+ Enter Custom Department</option>
                  </select>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    id="emp-dept"
                    name="department"
                    type="text"
                    placeholder="Enter custom department name"
                    className={`form-control ${errors.department ? 'has-error' : ''}`}
                    value={formData.department}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setCustomDept(false);
                      setFormData((prev) => ({ ...prev, department: '' }));
                    }}
                  >
                    Select List
                  </button>
                </div>
              )}
              {errors.department && (
                <div className="form-error-msg">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.department}</span>
                </div>
              )}
            </div>

            {/* Designation */}
            <div className="form-group">
              <label htmlFor="emp-designation" className="form-label">
                Designation <span className="required-star">*</span>
              </label>
              <input
                id="emp-designation"
                name="designation"
                type="text"
                placeholder="e.g. Senior Software Engineer"
                className={`form-control ${errors.designation ? 'has-error' : ''}`}
                value={formData.designation}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.designation && (
                <div className="form-error-msg">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.designation}</span>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Create Employee'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
