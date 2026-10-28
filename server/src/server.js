const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Start Express server and connect to MongoDB
const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Employee Management Server running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`👥 Employee API: http://localhost:${PORT}/api/employees`);
  });

  // Connect to MongoDB
  connectDB();

  // Handle unhandled promise rejections gracefully
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err.message);
  });

  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
