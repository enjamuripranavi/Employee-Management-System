import React from 'react';

export default function SearchBar({
  searchQuery,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  departments = [],
  sortBy,
  onSortChange,
}) {
  return (
    <div className="search-filter-group" role="search">
      <div className="search-input-wrapper">
        <svg
          className="search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          type="text"
          className="search-input"
          placeholder="Search by name, email, department..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search employees"
        />

        {searchQuery && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Department Filter */}
      <select
        className="select-filter"
        value={departmentFilter}
        onChange={(e) => onDepartmentChange(e.target.value)}
        aria-label="Filter by department"
      >
        <option value="">All Departments</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      {/* Sort Filter */}
      <select
        className="select-filter"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort employees by"
      >
        <option value="newest">Recently Added</option>
        <option value="name_asc">Name (A – Z)</option>
        <option value="name_desc">Name (Z – A)</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  );
}
