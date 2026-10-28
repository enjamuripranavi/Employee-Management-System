import React from 'react';

export default function StatsCards({ totalEmployees, departmentCount, selectedDepartment, onSelectDepartment }) {
  return (
    <section className="stats-grid" aria-label="Key Metrics">
      {/* Total Employees */}
      <div className="stat-card">
        <div className="stat-icon-wrapper" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-label">Total Employees</span>
          <span className="stat-value">{totalEmployees ?? 0}</span>
        </div>
      </div>

      {/* Departments Count */}
      <div className="stat-card">
        <div className="stat-icon-wrapper departments" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-label">Departments</span>
          <span className="stat-value">{departmentCount ?? 0}</span>
        </div>
      </div>
    </section>
  );
}
