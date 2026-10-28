import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StatsCards from './components/StatsCards';
import SearchBar from './components/SearchBar';
import EmployeeTable from './components/EmployeeTable';
import EmployeeModal from './components/EmployeeModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import DatabaseNotice from './components/DatabaseNotice';
import { employeeApi, formatErrorMessage } from './services/api';

const DEFAULT_DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Product',
  'Operations',
  'Design',
];

export default function App() {
  // Data States
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({ totalEmployees: 0, totalDepartments: 0, departmentDistribution: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dbConnected, setDbConnected] = useState(true);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalServerError, setModalServerError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Check backend health & DB connection
  const checkHealthStatus = useCallback(async () => {
    try {
      const data = await employeeApi.checkHealth();
      setDbConnected(Boolean(data?.database?.connected));
      return data?.database?.connected;
    } catch (err) {
      setDbConnected(false);
      return false;
    }
  }, []);

  // Load summary statistics
  const fetchStats = useCallback(async () => {
    try {
      const res = await employeeApi.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch stats:', err.message);
    }
  }, []);

  // Load employees list with search, department, and sort parameters
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (departmentFilter) params.department = departmentFilter;
      if (sortBy) params.sort = sortBy;

      const res = await employeeApi.getAll(params);
      if (res.success) {
        setEmployees(res.data || []);
        setDbConnected(true);
      }
    } catch (err) {
      const msg = formatErrorMessage(err);
      setError(msg);
      if (err.response?.status === 503 || msg.toLowerCase().includes('database')) {
        setDbConnected(false);
      }
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, departmentFilter, sortBy]);

  // Initial load
  useEffect(() => {
    checkHealthStatus();
    fetchEmployees();
    fetchStats();
  }, [fetchEmployees, fetchStats, checkHealthStatus]);

  // Unique departments for filter dropdown
  const allDepartments = useMemo(() => {
    const deptsFromEmployees = employees.map((e) => e.department).filter(Boolean);
    const combined = Array.from(new Set([...DEFAULT_DEPARTMENTS, ...deptsFromEmployees]));
    return combined.sort();
  }, [employees]);

  // Open modal for Adding
  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setModalServerError('');
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEditModal = (employee) => {
    setEditingEmployee(employee);
    setModalServerError('');
    setIsModalOpen(true);
  };

  // Handle Form Submit (Add or Edit)
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setModalServerError('');

    try {
      if (editingEmployee) {
        // UPDATE existing employee
        const empId = editingEmployee.id || editingEmployee._id;
        const res = await employeeApi.update(empId, formData);
        if (res.success) {
          showToast(`Employee "${formData.name}" updated successfully.`);
          setIsModalOpen(false);
          fetchEmployees();
          fetchStats();
        }
      } else {
        // CREATE new employee
        const res = await employeeApi.create(formData);
        if (res.success) {
          showToast(`Employee "${formData.name}" created successfully.`);
          setIsModalOpen(false);
          fetchEmployees();
          fetchStats();
        }
      }
    } catch (err) {
      const errorMsg = formatErrorMessage(err);
      setModalServerError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Delete Confirmation
  const handleOpenDelete = (employee) => {
    setDeletingEmployee(employee);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingEmployee) return;

    setIsDeleting(true);
    try {
      const empId = deletingEmployee.id || deletingEmployee._id;
      const res = await employeeApi.delete(empId);
      if (res.success) {
        showToast(`Employee "${deletingEmployee.name}" deleted successfully.`);
        setDeletingEmployee(null);
        fetchEmployees();
        fetchStats();
      }
    } catch (err) {
      const errorMsg = formatErrorMessage(err);
      showToast(errorMsg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        dbConnected={dbConnected}
        totalEmployees={stats.totalEmployees}
      />

      {/* Main App Content */}
      <div className="main-wrapper">
        <Header
          onOpenAddModal={handleOpenAddModal}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onRefresh={() => {
            checkHealthStatus();
            fetchEmployees();
            fetchStats();
          }}
          loading={loading}
        />

        <main className="page-content">
          {/* Database offline warning if DB is not connected */}
          <DatabaseNotice
            isConnected={dbConnected}
            onRetryCheck={() => {
              checkHealthStatus();
              fetchEmployees();
              fetchStats();
            }}
          />

          {/* Key Metrics Summary Cards */}
          <StatsCards
            totalEmployees={stats.totalEmployees}
            departmentCount={stats.totalDepartments}
            selectedDepartment={departmentFilter}
            onSelectDepartment={(dept) => setDepartmentFilter(dept)}
          />

          {/* Main Card: Controls & Employee Directory Table */}
          <div className="content-card">
            <div className="controls-bar">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                departmentFilter={departmentFilter}
                onDepartmentChange={setDepartmentFilter}
                departments={allDepartments}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>

            <EmployeeTable
              employees={employees}
              loading={loading}
              error={error}
              searchQuery={debouncedSearch}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDelete}
              onOpenAddModal={handleOpenAddModal}
              onRetry={fetchEmployees}
            />
          </div>
        </main>
      </div>

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingEmployee}
        isSubmitting={isSubmitting}
        serverError={modalServerError}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingEmployee)}
        onClose={() => setDeletingEmployee(null)}
        onConfirm={handleConfirmDelete}
        employee={deletingEmployee}
        isDeleting={isDeleting}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
