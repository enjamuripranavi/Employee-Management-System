import React from 'react';

// Department styling helper
const getDeptClass = (department = '') => {
  const normalized = department.toLowerCase().trim().replace(/[\s_]+/g, '-');
  return `dept-${normalized}`;
};

// Generate initials from employee name
const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function EmployeeTable({
  employees,
  loading,
  error,
  searchQuery,
  onEdit,
  onDelete,
  onOpenAddModal,
  onRetry,
}) {
  // Loading skeleton state
  if (loading) {
    return (
      <div className="table-responsive">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((idx) => (
              <tr key={idx} className="skeleton-row">
                <td><div className="skeleton-box" style={{ width: '140px' }} /></td>
                <td><div className="skeleton-box" style={{ width: '180px' }} /></td>
                <td><div className="skeleton-box" style={{ width: '90px' }} /></td>
                <td><div className="skeleton-box" style={{ width: '130px' }} /></td>
                <td><div className="skeleton-box" style={{ width: '70px', marginLeft: 'auto' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="state-container">
        <div className="state-icon" style={{ color: 'var(--danger)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="state-title">Failed to Load Employees</h3>
        <p className="state-desc">{error}</p>
        {onRetry && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Empty state when database has 0 employees
  if (employees.length === 0 && !searchQuery) {
    return (
      <div className="state-container">
        <div className="state-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h3 className="state-title">No Employees Found</h3>
        <p className="state-desc">Your directory is currently empty. Get started by adding your first employee record.</p>
        <button type="button" className="btn btn-primary" onClick={onOpenAddModal}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add First Employee</span>
        </button>
      </div>
    );
  }

  // Empty state when search returned 0 results
  if (employees.length === 0 && searchQuery) {
    return (
      <div className="state-container">
        <div className="state-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <h3 className="state-title">No Matching Records</h3>
        <p className="state-desc">
          No employees found matching &quot;<strong>{searchQuery}</strong>&quot;. Try refining your search query or department filter.
        </p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => {
            const empId = employee.id || employee._id;
            return (
              <tr key={empId}>
                <td>
                  <div className="employee-profile">
                    <div className="avatar-initial" aria-hidden="true">
                      {getInitials(employee.name)}
                    </div>
                    <div>
                      <div className="employee-name">{employee.name}</div>
                    </div>
                  </div>
                </td>
                <td>{employee.email}</td>
                <td>
                  <span className={`badge badge-dept ${getDeptClass(employee.department)}`}>
                    {employee.department}
                  </span>
                </td>
                <td>{employee.designation}</td>
                <td>
                  <div className="actions-cell">
                    <button
                      type="button"
                      className="action-btn edit"
                      onClick={() => onEdit(employee)}
                      title={`Edit ${employee.name}`}
                      aria-label={`Edit ${employee.name}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="action-btn delete"
                      onClick={() => onDelete(employee)}
                      title={`Delete ${employee.name}`}
                      aria-label={`Delete ${employee.name}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
