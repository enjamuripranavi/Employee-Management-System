import React from 'react';

export default function DatabaseNotice({ isConnected, onRetryCheck }) {
  if (isConnected) return null;

  return (
    <div className="db-alert-banner warning" role="alert">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0, marginTop: '2px' }}
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <div style={{ flex: 1 }}>
        <strong>MongoDB Connection Required:</strong> The backend server is running, but MongoDB is not currently connected.
        Database operations (Add, Edit, Delete, Fetch) require an active MongoDB instance.
        <ul style={{ marginTop: '0.4rem', paddingLeft: '1.25rem', fontSize: '0.84rem' }}>
          <li>
            <strong>Local MongoDB:</strong> Start your local MongoDB service (e.g., run <code>mongod</code> or start the Windows MongoDB service).
          </li>
          <li>
            <strong>MongoDB Atlas (Cloud):</strong> Set your connection string in <code>server/.env</code>:
            <br />
            <code>MONGODB_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.mongodb.net/employee_management</code>
          </li>
        </ul>
        <div style={{ marginTop: '0.6rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onRetryCheck}
            style={{ fontSize: '0.78rem', height: '28px' }}
          >
            Check Database Status Again
          </button>
        </div>
      </div>
    </div>
  );
}
