import React from 'react';

export default function Sidebar({ isOpen, onClose, dbConnected, totalEmployees }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Sidebar Navigation">
        <div className="sidebar-header">
          <div className="sidebar-logo-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <div className="sidebar-title">HR Portal</div>
          </div>
          <span className="sidebar-badge">v1.0</span>
        </div>

        <nav className="sidebar-nav">
          <button type="button" className="nav-item active" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            <span>All Employees</span>
            {totalEmployees !== undefined && (
              <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>
                {totalEmployees}
              </span>
            )}
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="status-indicator">
            <span className={`status-dot ${dbConnected ? 'online' : 'offline'}`} />
            <span>{dbConnected ? 'MongoDB Connected' : 'Database Offline'}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
