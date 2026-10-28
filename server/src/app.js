const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');
const errorHandler = require('./middleware/errorHandler');
const { isDBConnected } = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  const dbStatus = isDBConnected();
  res.status(dbStatus ? 200 : 503).json({
    status: dbStatus ? 'ok' : 'degraded',
    message: dbStatus
      ? 'Employee Management API is operating normally'
      : 'Database connection is pending or unavailable',
    database: {
      connected: dbStatus,
      state: dbStatus ? 'connected' : 'disconnected',
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Employee Routes
app.use('/api/employees', employeeRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found at ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
